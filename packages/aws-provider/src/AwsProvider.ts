import { Mapping, ProviderConstructor, ProviderImpl, ProviderOptions } from '@ocean/core';
import { AWS, GatewayResources, HandleResource, Param } from './types';
import fs from 'fs';
import path from 'path';
import { Lambda } from './resources/Lambda/Lambda';
import { Gateway } from './resources/Gateway/Gateway';
import { generateMappingsFromFiles, generateUniqueName, getFilesFromPath } from '@ocean/utils';
import { FolderNotFoundError } from './errors/FolderNotFoundError';
import { AwsProviderConfiguration } from './AwsProviderConfiguration';

const FILE_NAMES = {
	LAMBDAS: 'lambdas.terraform.tf.json',
	GATEWAY: 'gateway.terraform.tf.json',
};

interface AwsProviderConstructor extends ProviderConstructor {
	providerOptions: ProviderOptions;
}

export class AwsProvider extends ProviderImpl<AwsProviderConfiguration> {
	terraformConfiguration: GatewayResources;
	lambdasConfiguration: AWS.LambdaResources;

	// gateway resource
	apiGatewayResource: AWS.Resource;
	apiGatewayMethod: AWS.Method;
	apiGatewayIntegration: AWS.Integration;

	// lambda resources
	lambdasResources: AWS.LambdaFunction;
	lambdasPermissions: AWS.LambdaPermission;
	lambdaZip: AWS.LambdaData;

	constructor({ mappings, pathToFiles, providerOptions }: AwsProviderConstructor) {
		super({
			mappings,
			pathToFiles,
			providerOptions,
		});
		this.providerConfiguration = new AwsProviderConfiguration(providerOptions);
		this.apiGatewayResource = {};
		this.apiGatewayMethod = {};
		this.apiGatewayIntegration = {};
		this.lambdasResources = {};
		this.lambdasPermissions = {};
		this.lambdaZip = {};
	}

	async asyncRun() {
		await this.generateGatewayResources(this.pathToFiles);
		await this.generateLambdaResources();
	}

	parseParameters(parameters): Param[] {
		return Object.keys(parameters).map((parameterKey) => {
			return {
				name: parameterKey,
				mandatory: parameters[parameterKey],
			};
		});
	}

	getParametersFromPath(pathname: string): Param[] {
		return pathname
			.split('/')
			.map((pathPart) => {
				if (pathPart.includes(':')) {
					return {
						name: pathPart.replace(':', ''),
						mandatory: true,
					};
				}
				return undefined;
			})
			.filter(Boolean);
	}

	handleResource({ pathPart, index, parts, route, lambdaName, params }: HandleResource): void {
		const isUrlParameter = pathPart.includes(':');
		const currentPathName = pathPart.replace(':', '');
		let urlParameters = [];
		let queryStringParameters = [];
		if (isUrlParameter) {
			urlParameters = this.getParametersFromPath(route);
		}
		if (params) {
			queryStringParameters = this.parseParameters(params);
		}
		const gateway = new Gateway(this.providerConfiguration, {
			parentId: index > 0 ? generateUniqueName(parts.slice(0, index)) : undefined,
			pathname: currentPathName,
			isUrlParameter,
			id: generateUniqueName(parts.slice(0, index + 1)),
			params: urlParameters,
			queryStringParams: queryStringParameters,
			lambdaName,
		});

		const gatewayResource = gateway.generate();

		this.apiGatewayResource[gatewayResource.resource.uniqueId] = gatewayResource.resource.resource;
		this.apiGatewayMethod[gatewayResource.method.uniqueId] = gatewayResource.method.resource;
		this.apiGatewayIntegration[gatewayResource.integration.uniqueId] = gatewayResource.integration.resource;
	}

	/*
	 *
	 * @param {Route} routeObject
	 */
	generateResourcesFromMappings(): void {
		this.mappings.forEach((currentRoute) => {
			const { params, page, route } = currentRoute;
			const lambdaName = page.replace('/', '');
			route
				.split('/')
				.filter(Boolean)
				.forEach((pathPart, index, parts) => {
					this.handleResource({
						pathPart,
						index,
						parts,
						route,
						lambdaName,
						params,
					});
				});
		});
	}

	deleteDir(pathToDelete): void {
		if (fs.existsSync(pathToDelete)) {
			fs.readdirSync(pathToDelete).forEach((file) => {
				const curPath = path.join(pathToDelete, file);
				if (fs.lstatSync(curPath).isDirectory()) {
					// recurse
					this.deleteDir(curPath);
				} else {
					// delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(pathToDelete);
		}
	}

	/**
	 *
	 * @param {boolean} write
	 * @returns {Promise<{}|*>}
	 */
	async generateGatewayResources(lambdasDirectory: string, write = false): Promise<void | GatewayResources> {
		try {
			const files = await getFilesFromPath(lambdasDirectory);
			this.generateResourcesFromMappings();

			this.terraformConfiguration = {
				resource: {
					aws_api_gateway_resource: this.apiGatewayResource,
					aws_api_gateway_method: this.apiGatewayMethod,
					aws_api_gateway_integration: this.apiGatewayIntegration,
				},
				variable: {
					integrationList: {
						default: Object.keys(this.apiGatewayIntegration).map(
							(key) => `aws_api_gateway_integration.${key}`
						),
					},
				},
			};

			if (write) {
				// eslint-disable-next-line no-console
				console.log(`Generating file ${FILE_NAMES.GATEWAY}`);
				fs.writeFileSync(
					path.join(process.cwd(), FILE_NAMES.GATEWAY),
					JSON.stringify(this.terraformConfiguration, null, 4),
					{
						encoding: 'utf-8',
					}
				);
			} else {
				return this.terraformConfiguration;
			}
		} catch (error) {
			throw new Error(error);
		}
	}

	generateLambdaResources(
		destinationDirectory: string,
		lambdasDirectory: string,
		write = false
	): Promise<void | AWS.LambdaResources> {
		const inputPathLambdas = path.resolve(destinationDirectory, 'lambdas');

		if (fs.existsSync(inputPathLambdas)) {
			this.deleteDir(inputPathLambdas);
		}
		// it creates the folder that will contain the lambdas
		fs.mkdirSync(path.resolve(inputPathLambdas));

		return getFilesFromPath(lambdasDirectory)
			.then(async (files) => {
				for await (const file of files) {
					const pathToFile = path.resolve(lambdasDirectory, file);
					if (!fs.lstatSync(pathToFile).isDirectory()) {
						/**
						 * 1. create a folder with name of the file
						 * 2. copy the next file with a suffix .original.js
						 * 3. create the lambda from the template
						 * 4. copy the compact layer
						 * 5. generate the lambda resource
						 * 6. generate the zip file resource
						 */
						// 1.
						const lambdaName = file.replace('.js', '');
						const lambdaPath = path.resolve(inputPathLambdas) + '/' + lambdaName;
						fs.mkdirSync(lambdaPath);

						// 2.
						const newFilename = file.replace('.js', '.original.js');
						fs.copyFileSync(pathToFile, path.resolve(inputPathLambdas, lambdaName, newFilename));

						const lambda = new Lambda(this.providerConfiguration, {
							id: lambdaName,
							directoryName: lambdaName,
						});
						// 3.
						lambda.emitLambdaFile(destinationDirectory, lambdaName);
						await lambda.installDependencies(destinationDirectory, lambdaName);

						// 5.
						const lambdaResource = lambda.generate();
						this.lambdasResources[lambdaResource.properties.resourceUniqueId] =
							lambdaResource.properties.resource;
						this.lambdasPermissions[lambdaResource.permissions.permissionUniqueId] =
							lambdaResource.permissions.resource;
						this.lambdaZip[lambdaResource.zip.uniqueId] = lambdaResource.zip.resource;
					}
				}

				// it gets files that are inside the serverless folder created by next
				fs.readdirSync(lambdasDirectory);

				this.lambdasConfiguration = {
					resource: {
						aws_lambda_function: this.lambdasResources,
						aws_lambda_permission: this.lambdasPermissions,
					},
					data: {
						archive_file: this.lambdaZip,
					},
				};

				if (write === true) {
					// eslint-disable-next-line no-console
					console.log(`Generating file ${FILE_NAMES.LAMBDAS}`);
					fs.writeFileSync(
						path.join(process.cwd(), FILE_NAMES.LAMBDAS),
						JSON.stringify(this.lambdasConfiguration, null, 4),
						{
							encoding: 'utf-8',
						}
					);
				} else {
					return this.lambdasConfiguration;
				}
			})
			.catch((error) => {
				throw new FolderNotFoundError(lambdasDirectory, error);
			});
	}
}
