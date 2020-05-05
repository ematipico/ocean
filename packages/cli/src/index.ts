import meow = require('meow');
import { cosmiconfig } from 'cosmiconfig';
import { StringFlag } from 'meow';
import { usage } from './usage';
import { Ocean } from '@ocean/core';

const explorer = cosmiconfig('ocean');

interface Flags extends meow.AnyFlags {
	env: StringFlag;
}
const cli = meow<Flags>(usage, {
	flags: {
		// gatewayKey: {
		//     type: "string",
		//     default: "Terranext",
		//     alias: "g"
		// },
		// nextAppDir: {
		//     type: "string",
		//     alias: "d",
		//     default: "./"
		// },
		// provider: {
		//     type: "string"
		// },
		env: {
			type: 'string',
		},
	},
});

export function run() {
	explorer
		.search()
		.then(async (result) => {
			const { gatewayKey, nextAppDir, provider, env } = cli.flags;

			let parsedEnvs;
			if (env) {
				parsedEnvs = parseEnv(env);
			}
			const options = {
				...result.config,
				gatewayKey,
				nextAppDir,
				provider,
				env: parsedEnvs,
			};
			const ocean = new Ocean(options);
			await ocean.run();
		})
		.catch((error) => {
			// eslint-disable-next-line no-console
			console.error(error);
			process.exit(1);
		});

	function parseEnv(unparsedEnv) {
		if (Array.isArray(unparsedEnv)) {
			return unparsedEnv.map((env) => {
				const splitEnv = env.split(',');
				return {
					key: splitEnv[0],
					value: splitEnv[1],
				};
			});
		}

		const splitEnv = unparsedEnv.split(',');

		return [
			{
				key: splitEnv[0],
				value: splitEnv[1],
			},
		];
	}
}
