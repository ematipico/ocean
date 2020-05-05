import { AdapterEnum, ProviderEnum } from './Ocean';
import { NoAdapterFound } from './errors/NoAdapterFound';
import { NoProviderFound } from './errors/NoProviderFound';

export function createNewAdapter<AdapterInterface>(adapter: AdapterEnum): AdapterInterface {
	try {
		const { Adapter } = require(adapter);
		return new Adapter();
	} catch (e) {
		throw new NoAdapterFound(adapter, e);
	}
}

export function createNewProvider(provider: ProviderEnum) {
	try {
		const { Provider } = require(provider);
		return new Provider();
	} catch (e) {
		throw new NoProviderFound(provider, e);
	}
}
