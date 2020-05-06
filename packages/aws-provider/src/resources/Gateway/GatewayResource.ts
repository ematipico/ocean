import { AwsGatewayOptions } from '../../types';
import { AwsProviderConfiguration } from '../../AwsProviderConfiguration';

interface Resource {
	rest_api_id: string;
	parent_id: string;
	path_part: string;
}

export interface GeneratedGatewayResource {
	uniqueId: string;
	resource: Resource;
}

export class GatewayResource {
	config: AwsProviderConfiguration;
	options: AwsGatewayOptions;
	parentResourceName: string;
	/**
	 *
	 * @param {AwsProviderConfiguration} config
	 * @param {AwsGatewayOptions} options
	 */
	constructor(config: AwsProviderConfiguration, options: AwsGatewayOptions) {
		this.config = config;
		this.options = options;
		this.parentResourceName = this.createUniqueId(this.options.parentId);
	}

	/**
	 * It generates the ApiGateway resource
	 * @returns
	 */
	generateGatewayResource(): GeneratedGatewayResource {
		return {
			uniqueId: this.generateUniqueId(),
			resource: this.generateResource(),
		};
	}

	/**
	 *
	 * @returns string
	 */
	generateUniqueId(): string {
		return `${this.config.gateway.identifier}-${this.options.id}`;
	}

	/**
	 *
	 * @returns string
	 */
	createUniqueId(id): string | undefined {
		if (!id) return undefined;
		return `${this.config.gateway.identifier}-${id}`;
	}

	/**
	 * It generates the single resource
	 */
	generateResource(): Resource {
		return {
			rest_api_id: this.config.getGatewayResourceId(),
			parent_id: this.options.parentId
				? '${aws_api_gateway_resource.' + this.parentResourceName + '.id}'
				: this.config.getRootResource(),
			path_part: this.options.isUrlParameter ? `{${this.options.pathname}}` : this.options.pathname,
		};
	}
}
