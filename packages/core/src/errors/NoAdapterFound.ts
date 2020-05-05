import { AdapterEnum } from '../Ocean';

export class NoAdapterFound extends Error {
	constructor(adapter: AdapterEnum, e: Error) {
		super();
		this.name = 'NoAdapterFound';
		this.message = `Cannot find the package "${adapter}" or the package doesn't export the "Adapter" class`;
		this.stack = e.stack;
	}
}
