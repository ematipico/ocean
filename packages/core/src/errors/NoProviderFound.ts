import { ProviderEnum } from '../Ocean';

export class NoProviderFound extends Error {
	constructor(provider: ProviderEnum, e: Error) {
		super();
		this.name = 'NoProviderFound';
		this.message = `Cannot find the package "${provider}" or the package doesn't export the "Provider" class`;
		this.stack = e.stack;
	}
}
