import { ProviderOptions, EnvironmentVariables } from '@ocean/core';

type Runtime = 'nodejs10.x' | 'nodejs12.x';

export interface LambdaConfiguration {
	runtimeVersion: Runtime;
	environmentVariables?: EnvironmentVariables;
	memorySize: string;
	timeout: string;
}

export interface GatewayConfiguration {
	identifier: string;
}

export class AwsProviderConfiguration {
	gateway: GatewayConfiguration;
	lambda: LambdaConfiguration;

	constructor(options: ProviderOptions) {
		const {
			timeout = '180',
			gatewayKey: key = 'Ocean',
			runtimeVersion = '10',
			memorySize = '1024',
			environmentVariables,
		} = options;

		this.lambda = {
			runtimeVersion: AwsProviderConfiguration.getNodeVersion(runtimeVersion),
			environmentVariables,
			memorySize,
			timeout,
		};
		this.gateway = {
			identifier: key,
		};
	}

	static getNodeVersion(runtimeVersion: string): Runtime {
		switch (runtimeVersion) {
			case '10': {
				return 'nodejs10.x';
			}
			case '12': {
				return 'nodejs12.x';
			}
			default:
				return 'nodejs10.x';
		}
	}

	/**
	 * @returns {string}
	 */
	getLambdaPrefix() {
		return `lambdaFor${this.gateway.identifier}`;
	}

	/**
	 * @returns {string}
	 */
	getGatewayResourceId() {
		return '${aws_api_gateway_rest_api.' + this.gateway.identifier + '.id}';
	}

	/**
	 * @returns {string}
	 */
	getRootResource() {
		return '${aws_api_gateway_rest_api.' + this.gateway.identifier + '.root_resource_id}';
	}
}
