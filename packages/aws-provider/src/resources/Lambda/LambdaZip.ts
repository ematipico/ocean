import { AwsConfig } from '../../AwsConfig';
import { AWS, LambdaOptions } from '../../types';
import path from 'path';
import { AwsProviderConfiguration } from '../../AwsProviderConfiguration';

export interface GeneratedZipResource {
	uniqueId: string;
	resource: AWS.Data;
}

export class LambdaZip {
	config: AwsProviderConfiguration;
	options: LambdaOptions;

	/**
	 *
	 * @param {AwsConfig} config
	 * @param {LambdaOptions} options
	 */
	constructor(config: AwsProviderConfiguration, options: LambdaOptions) {
		this.config = config;
		this.options = options;
	}

	/**
	 * It generates the Lambda resource
	 */
	generateZipResource(): GeneratedZipResource {
		const cleanedId = this.options.id.replace(/\[|]/g, '');

		return {
			uniqueId: `packLambda-${cleanedId}`,
			resource: {
				output_path: 'files/${local.groupname}-' + this.options.id + '.zip',
				type: 'zip',
				source_dir: path.join(this.config.getLambdaPath(), this.options.directoryName),
			},
		};
	}
}

