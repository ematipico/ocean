export interface Mapping {
	page: string;
	route: string;
	params?: Param[];
}

export interface Param {
	name: string;
	mandatory?: boolean;
}

export abstract class Adapter {
	abstract async build(): Promise<void>;

	abstract loadConfiguration(): void;

	abstract async asyncGenerateMappings(): Promise<Mapping[]>;

	abstract generateMappings(): Mapping;
}
