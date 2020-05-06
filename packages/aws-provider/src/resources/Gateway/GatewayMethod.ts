import { AWS, AwsGatewayOptions } from '../../types';
import { AwsProviderConfiguration } from '../../AwsProviderConfiguration';

export interface GatewayMethodResource {
	rest_api_id: string;
	resource_id: string;
	http_method: string;
	authorization: string;
	request_parameters?: AWS.RequestParameter;
}

export interface GeneratedGatewayMethod {
	uniqueId: string;
	resource: GatewayMethodResource;
}

export class GatewayMethod {
	config: AwsProviderConfiguration;
	options: AwsGatewayOptions;
	/**
	 *
	 * @param {AwsProviderConfiguration} config
	 * @param {AwsGatewayOptions} options
	 */
	constructor(config: AwsProviderConfiguration, options: AwsGatewayOptions) {
		this.config = config;
		this.options = options;
	}

	/**
	 * It generates the resource for the single method
	 *
	 * @returns
	 */
	generateGatewayMethod(gatewayResourceId: string): GeneratedGatewayMethod {
		return {
			uniqueId: `${this.config.gateway.identifier}-${this.options.id}`,
			resource: this.generateResource(gatewayResourceId),
		};
	}

	/**
	 *
	 * @param {string} resourceId
	 */
	generateResource(resourceId): GatewayMethodResource {
		const resource: GatewayMethodResource = {
			rest_api_id: this.config.getGatewayResourceId(),
			resource_id: '${aws_api_gateway_resource.' + resourceId + '.id}',
			http_method: 'GET',
			authorization: 'NONE',
		};
		if (this.options.params && this.options.params.length > 0) {
			resource.request_parameters = this.options.params.reduce((result, parameter) => {
				result[`method.request.path.${parameter.name}`] = parameter.mandatory === true ? 'true' : 'false';

				return result;
			}, resource.request_parameters || {});
		}
		if (this.options.queryStringParams && this.options.queryStringParams.length > 0) {
			resource.request_parameters = this.options.queryStringParams.reduce((result, parameter) => {
				result[`method.request.querystring.${parameter.name}`] =
					parameter.mandatory === true ? 'true' : 'false';

				return result;
			}, resource.request_parameters || {});
		}
		return resource;
	}
}
