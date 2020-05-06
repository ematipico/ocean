import { Mapping } from './Adapter';

export abstract class Provider {
	abstract setMappings(mappings: Mapping[]): void;

	abstract run(): void;

	abstract async asyncRun(): Promise<void>;
}
