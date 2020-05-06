import { AWS, LambdaOptions } from '../../types';
import { AwsProviderConfiguration } from '../../AwsProviderConfiguration';

export interface GeneratedLambdaProperties {
	resourceUniqueId: string;
	resource: AWS.Function;
}

export class LambdaProperties {
	config: AwsProviderConfiguration;
	options: LambdaOptions;

	constructor(config: AwsProviderConfiguration, options: LambdaOptions) {
		this.config = config;
		this.options = options;
	}

	/**
	 * It generates the Lambda resource
	 *
	 */
	generateLambdaProperties(): GeneratedLambdaProperties {
		const cleanedId = this.options.id.replace(/\[|]/g, '');
		const lambdaId = `${this.config.getLambdaPrefix()}-${cleanedId}`;
		const resource: GeneratedLambdaProperties = {
			resourceUniqueId: lambdaId,
			resource: {
				filename: '${data.archive_file.packLambda-' + cleanedId + '.output_path}',
				function_name: '${local.groupname}-' + cleanedId,
				source_code_hash: '${data.archive_file.packLambda-' + cleanedId + '.output_base64sha256}',
				handler: this.options.id + '.render',
				runtime: this.config.lambda.runtimeVersion,
				memory_size: '1024',
				timeout: '180',
				role: '${local.lambda_iam_role}',
			},
		};
		if (this.config.lambda.environmentVariables) {
			resource.resource.environment = {
				variables: this.config.lambda.environmentVariables,
			};
		}

		return resource;
	}
}
