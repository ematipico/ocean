import { LambdaOptions, AWS } from '../../types';
import { AwsProviderConfiguration } from '../../AwsProviderConfiguration';

export interface GeneratedLambdaPermission {
	permissionUniqueId: string;
	resource: AWS.Permission;
}

export class LambdaPermission {
	config: AwsProviderConfiguration;
	options: LambdaOptions;
	/**
	 *
	 * @param {AwsConfig} config
	 * @param {LambdaOptions} options
	 */
	constructor(config: AwsProviderConfiguration, options) {
		this.config = config;
		this.options = options;
	}

	generateLambdaPermissions(): GeneratedLambdaPermission {
		const cleanedId = this.options.id.replace(/\[|]/g, '');
		const lambdaId = `${this.config.getLambdaPrefix()}-${cleanedId}`;
		return {
			permissionUniqueId: lambdaId,
			resource: {
				statement_id: 'AllowExecutionFromAPIGateway',
				action: 'lambda:InvokeFunction',
				function_name: '${aws_lambda_function.' + lambdaId + '.function_name}',
				principal: 'apigateway.amazonaws.com',
				source_arn: '${aws_api_gateway_rest_api.' + this.config.gateway.identifier + '.execution_arn}/*/*/*',
			},
		};
	}
}

