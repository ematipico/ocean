import { Adapter, Mapping } from './Adapter';
import { OceanOptions } from './Ocean';

export class AdapterImpl<FrameworkConfiguration> implements Adapter {
	mapping: Mapping;
	frameworkConfiguration?: FrameworkConfiguration;
	protected oceanOptions: OceanOptions;

	constructor(options: OceanOptions) {
		this.oceanOptions = options;
	}

	async build(): Promise<void> {
		return Promise.reject('Implement me');
	}

	loadConfiguration(): void {
		throw new Error('Implement me');
	}

	async asyncGenerateMappings(): Promise<Mapping[]> {
		return Promise.reject([]);
	}

	generateMappings(): Mapping {
		throw new Error('Implement me');
	}
}
