import { AdapterImpl, Mapping } from '@ocean/core';
import path from 'path';
import { NEXT_CONFIG } from './constants';
import fs from 'fs';
import { generateMappingsFromFiles, getFilesFromPath } from '@ocean/utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const buildNextApp = require('next/dist/build').default;

interface NextConfiguration {
	appDir: string;
	target: string;
	buildPath: string;
}

export class NextJsAdapter extends AdapterImpl<NextConfiguration> {
	/**
	 *
	 * @returns {any}
	 */
	loadConfiguration(): NextConfiguration {
		const nextConfigFilePath = path.resolve(this.oceanOptions.frameworkDirectory, NEXT_CONFIG);
		if (fs.existsSync(nextConfigFilePath)) {
			return require(nextConfigFilePath);
		}
		throw new Error('Missing config file inside the Next.js folder: ' + nextConfigFilePath);
	}

	async build(): Promise<void> {
		const nextConfig = this.loadConfiguration();
		nextConfig.target = 'serverless';
		await buildNextApp(this.oceanOptions.frameworkDirectory, nextConfig);
	}

	async generateMappings(): Promise<Mapping[]> {
		const files = await getFilesFromPath(this.getServerlessPagesPath());
		return generateMappingsFromFiles(files);
	}

	private getServerlessPagesPath(): string {
		return path.resolve(
			this.oceanOptions.frameworkDirectory,
			this.frameworkConfiguration.buildPath,
			'serverless',
			'pages'
		);
	}
}
