import {MissingOceanConfiguration} from "./errors/MissingOceanConfiguration";
import {Adapter} from "./Adapter";
import {createNewAdapter} from "./factory";

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

export class Ocean<AdapterInterface extends Adapter = Adapter> {
	adapter: AdapterInterface;
	provider: ProviderEnum;

	constructor({ adapter, provider }: OceanConfiguration) {
		if (!adapter || !provider) {
			throw new MissingOceanConfiguration();
		}

		this.adapter = createNewAdapter<AdapterInterface>(adapter);
		this.provider = provider;
	}

	async run() {
		await Promise.resolve();
	}
}
