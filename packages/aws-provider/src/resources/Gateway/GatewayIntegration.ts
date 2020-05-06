import { AwsConfig } from '../../AwsConfig';
import { AWS, AwsGatewayOptions } from '../../types';
import { AwsProviderConfiguration } from '../../AwsProviderConfiguration';

export interface GeneratedGatewayIntegration {
	uniqueId: string;
	resource: GatewayIntegrationResource;
}

interface GatewayIntegrationResource {
	rest_api_id: string;
	resource_id: string;
	http_method: string;
	integration_http_method: string;
	type: string;
	uri: string;
	request_parameters?: AWS.RequestParameter;
}

export class GatewayIntegration {
	config: AwsProviderConfiguration;
	options: AwsGatewayOptions;

	/**
	 *
	 * @param {AwsConfig} config
	 * @param {AwsGatewayOptions} options
	 */
	constructor(config: AwsProviderConfiguration, options: AwsGatewayOptions) {
		this.config = config;
		this.options = options;
	}

	/**
	 * It generates the integration resource
	 *
	 * @param {string} gatewayResourceId
	 */
	generateGatewayIntegration(gatewayResourceId): GeneratedGatewayIntegration {
		return {
			uniqueId: `${this.config.getGatewayKey()}-${this.options.id}`,
			resource: this.generateResource(gatewayResourceId),
		};
	}

	/**
	 *
	 *
	 * @param {string} gatewayResourceId
	 */
	generateResource(gatewayResourceId): GatewayIntegrationResource {
		const resource: GatewayIntegrationResource = {
			rest_api_id: '${aws_api_gateway_rest_api.' + this.config.getGatewayKey() + '.id}',
			resource_id: '${aws_api_gateway_resource.' + gatewayResourceId + '.id}',
			http_method: 'GET',
			integration_http_method: 'POST',
			type: 'AWS_PROXY',
			uri:
				'arn:aws:apigateway:${local.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.' +
				this.config.getLambdaPrefix() +
				'-' +
				this.options.lambdaName +
				'.arn}/invocations',
		};

		if (this.options.params && this.options.params.length > 0) {
			resource.request_parameters = this.options.params.reduce((result, parameter) => {
				result[`integration.request.path.${parameter.name}`] = `method.request.path.${parameter.name}`;

				return result;
			}, resource.request_parameters || {});
		}

		if (this.options.queryStringParams && this.options.queryStringParams.length > 0) {
			resource.request_parameters = this.options.queryStringParams.reduce((result, parameter) => {
				result[
					`integration.request.querystring.${parameter.name}`
				] = `method.request.querystring.${parameter.name}`;

				return result;
			}, resource.request_parameters || {});
		}

		return resource;
	}
}
