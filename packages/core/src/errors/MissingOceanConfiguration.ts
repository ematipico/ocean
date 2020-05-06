export class MissingOceanConfiguration extends Error {
	constructor() {
		super();
		this.message = 'Adapter or Provider are missing';
	}
}
