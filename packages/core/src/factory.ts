import { AdapterEnum, ProviderEnum } from './Ocean';
import { NoAdapterFound } from './errors/NoAdapterFound';
import { NoProviderFound } from './errors/NoProviderFound';

export function createNewAdapter<AdapterInterface>(adapter: AdapterEnum): AdapterInterface {
	try {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { Adapter } = require(adapter);
		return new Adapter();
	} catch (e) {
		throw new NoAdapterFound(adapter, e);
	}
}

export function createNewProvider<ProviderInterface, ProviderOptions>(
	provider: ProviderEnum,
	options?: ProviderOptions
): ProviderInterface {
	try {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { Provider } = require(provider);
		return new Provider(options);
	} catch (e) {
		throw new NoProviderFound(provider, e);
	}
}
