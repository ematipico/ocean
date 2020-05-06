import { Mapping } from '@ocean/core';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';

/**
 *
 * @param {string} fileName
 * @param {string} [pathPart]
 * @returns {string}
 */

export function generatePathFromFile(fileName: string, pathPart?: string): string {
	if (fileName.includes('index') && pathPart) {
		const parts = pathPart.split('/');
		return '/' + parts[parts.length - 1].replace('.js', '').replace(':', '').replace(/\[/gm, '').replace(/]/gm, '');
	}
	return '/' + fileName.replace('.js', '').replace(/\[/gm, '').replace(/]/gm, '');
}

/**
 * It returns a Route object from a list of files
 *
 * @param {string[]} files An array of file names
 * @returns {Mapping}
 */
export function generateMappingsFromFiles(files): Mapping[] {
	return files.reduce((mappings, file) => {
		const path = generatePathFromFile(file);
		mappings.push({
			route: path,
			page: path,
		});

		return mappings;
	}, [] as Mapping[]);
}

/**
 * It returns the files inside a folder
 *
 * @param {string} filePath The Path to the lambdas
 * @returns {Promise<string[]>}
 */
export async function getFilesFromPath(filePath: string): Promise<string[]> {
	try {
		const readDirectory = promisify(fs.readdir);

		const files = await readDirectory(filePath);

		return files.map((file) => {
			const pathToFile = path.resolve(filePath, file);
			if (fs.existsSync(pathToFile) && !fs.lstatSync(pathToFile).isDirectory()) {
				return file;
			}
			return file;
		});
	} catch (error) {
		return [];
	}
}

/**
 * From an array of parts of an URL, it generates a string
 * with only dash.
 *
 * It can be used inside a terraform configuration
 *
 * @param {string[]} pathParts
 * @returns {string}
 */
export const generateUniqueName = (pathParts: string[]): string => {
	return pathParts
		.filter(Boolean)
		.map((p) => p.replace(':', '').replace('?', ''))
		.join('-');
};
