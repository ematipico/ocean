import { Adapter } from './Adapter';

export class AdapterImpl implements Adapter {
	build(): void {
		throw new Error('Implement me');
	}

	loadConfiguration(): void {
		throw new Error('Implement me');
	}
}
