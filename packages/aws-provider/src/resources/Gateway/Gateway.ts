import { GatewayIntegration, GeneratedGatewayIntegration } from './GatewayIntegration';
import { GatewayMethod, GeneratedGatewayMethod } from './GatewayMethod';
import { GatewayResource, GeneratedGatewayResource } from './GatewayResource';
import { AwsGatewayOptions } from '../../types';
import { AwsProviderConfiguration } from '../../AwsProviderConfiguration';

interface GeneratedResources {
	resource: GeneratedGatewayResource;
	method: GeneratedGatewayMethod;
	integration: GeneratedGatewayIntegration;
}

export class Gateway {
	gatewayIntegration: GatewayIntegration;
	gatewayMethod: GatewayMethod;
	gatewayResource: GatewayResource;

	/**
	 *
	 * @param config
	 * @param {AwsGatewayOptions} options
	 */
	constructor(config: AwsProviderConfiguration, options: AwsGatewayOptions) {
		this.gatewayIntegration = new GatewayIntegration(config, options);
		this.gatewayMethod = new GatewayMethod(config, options);
		this.gatewayResource = new GatewayResource(config, options);
	}

	/**
	 * @returns
	 */
	getResource(): GeneratedGatewayResource {
		return this.gatewayResource.generateGatewayResource();
	}

	/**
	 *
	 * @param {string} gatewayResourceId
	 */
	getMethod(gatewayResourceId: string): GeneratedGatewayMethod {
		return this.gatewayMethod.generateGatewayMethod(gatewayResourceId);
	}

	/**
	 *
	 * @param {string} gatewayResourceId
	 */
	getIntegration(gatewayResourceId: string): GeneratedGatewayIntegration {
		return this.gatewayIntegration.generateGatewayIntegration(gatewayResourceId);
	}

	/**
	 * @returns {object}
	 */
	generate(): GeneratedResources {
		const resource = this.getResource();
		const method = this.getMethod(resource.uniqueId);
		const integration = this.getIntegration(resource.uniqueId);

		return {
			resource,
			method,
			integration,
		};
	}
}
