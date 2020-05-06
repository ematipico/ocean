import { LambdaOptions } from '../../types';
import { GeneratedLambdaProperties, LambdaProperties } from './LambdaProperties';
import { GeneratedZipResource, LambdaZip } from './LambdaZip';
import { GeneratedLambdaPermission, LambdaPermission } from './LambdaPermission';
import fs from 'fs';
import path from 'path';
import { AwsProviderConfiguration } from '../../AwsProviderConfiguration';
import execa, { ExecaReturnValue } from 'execa';

export interface GenerateLambda {
	properties: GeneratedLambdaProperties;
	zip: GeneratedZipResource;
	permissions: GeneratedLambdaPermission;
}

export class Lambda {
	config: AwsProviderConfiguration;
	options: LambdaOptions;
	properties: LambdaProperties;
	zip: LambdaZip;
	permissions: LambdaPermission;
	/**
	 *
	 * @param {AwsConfig} config
	 * @param options
	 */
	constructor(config: AwsProviderConfiguration, options: LambdaOptions) {
		this.config = config;
		this.options = options;
		this.properties = new LambdaProperties(this.config, this.options);
		this.zip = new LambdaZip(this.config, this.options);
		this.permissions = new LambdaPermission(this.config, this.options);
	}

	emitLambdaFile(thePath: string, filename: string): void {
		const lambdaTemplate = `
const middy = require('@middy/core');
const requestResponse = require('@ematipico/middy-request-response');
const page = require('./${filename}.original.js');

const renderRequest = (event, context) => {
  	const { response, request } = context;
	page.render(request, response);
}

const render = middy(renderRequest)
  .use(requestResponse()
}

module.exports = { render }
`;
		fs.writeFileSync(path.resolve(thePath, 'lambdas', filename, filename + '.js'), lambdaTemplate, {
			encoding: 'utf-8',
		});
	}

	async installDependencies(thePath: string, filename: string): Promise<ExecaReturnValue> {
		const finalPath = path.resolve(thePath, 'lambdas', filename);

		// reduce number of deps
		return execa('npm i --production', {
			cwd: finalPath,
			stdout: 'inherit',
		});
	}

	generate(): GenerateLambda {
		const properties = this.properties.generateLambdaProperties();
		const zip = this.zip.generateZipResource();
		const permissions = this.permissions.generateLambdaPermissions();

		return {
			properties,
			zip,
			permissions,
		};
	}
}
