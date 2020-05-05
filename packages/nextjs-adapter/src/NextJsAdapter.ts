import { AdapterImpl } from '@ocean/core';
import path from 'path';

export class NextJsAdapter extends AdapterImpl {
	/**
	 *
	 * @returns {any}
	 */
	loadConfiguration() {
		// const nextConfigFilePath = path.resolve(this.properties.nextAppDir, NEXT_CONFIG);
		// if (fs.existsSync(nextConfigFilePath)) {
		//     return require(nextConfigFilePath);
		// }
		// throw new Error("Missing config file inside the Next.js folder: " + nextConfigFilePath);
	}
}
