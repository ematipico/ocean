import { MissingOceanConfiguration } from './errors/MissingOceanConfiguration';
import { Adapter } from './Adapter';
import { createNewAdapter, createNewProvider } from './factory';
import { Provider } from './Provider';

export enum AdapterEnum {
	NuxtJS = '@ocean/nuxt-adapter',
	NextJS = '@ocean/next-adapter',
}
export enum ProviderEnum {
	AWS = '@ocean/aws-provider',
}

export interface OceanConfiguration {
	adapter: AdapterEnum;
	provider: ProviderEnum;
}

export interface OceanOptions {
	frameworkDirectory: string;
}

export class Ocean<AdapterInterface extends Adapter = Adapter, ProviderInterface extends Provider = Provider> {
	adapter: AdapterInterface;
	provider: ProviderInterface;

	constructor({ adapter, provider }: OceanConfiguration) {
		if (!adapter || !provider) {
			throw new MissingOceanConfiguration();
		}

		this.adapter = createNewAdapter<AdapterInterface>(adapter);
		this.provider = createNewProvider<ProviderInterface>(provider);
	}

	async asyncRun(): Promise<void> {
		this.adapter.loadConfiguration();
		const mappings = await this.adapter.asyncGenerateMappings();
		this.provider.setMappings(mappings);
		await this.provider.asyncRun();
		await Promise.resolve();
	}
}
