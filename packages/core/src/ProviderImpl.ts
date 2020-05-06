import { Provider } from './Provider';
import { Mapping } from './Adapter';
import { ProviderOptions } from './ProviderOptions';

export interface ProviderConstructor {
	mappings: Mapping[];
	pathToFiles: string;
	providerOptions: ProviderOptions;
}

export class ProviderImpl<ProviderConfiguration> implements Provider {
	providerConfiguration: ProviderConfiguration;
	protected pathToFiles: string;
	protected mappings: Mapping[];

	constructor({ mappings, pathToFiles }: ProviderConstructor) {
		this.mappings = mappings;
		this.pathToFiles = pathToFiles;
	}

	setMappings(mappings: Mapping[]): void {
		this.mappings = mappings;
	}

	async asyncRun(): Promise<void> {
		return Promise.reject('Implement me');
	}

	run(): void {
		throw new Error('Implement me');
	}
}
