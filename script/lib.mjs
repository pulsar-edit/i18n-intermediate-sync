// @ts-check

import * as fs from "fs";
import * as path from "path";

/**
 * @param {string} rootpath
 * @param {(path_segments: Array<string>) => void} cb
 * @param {Array<string>} path_segments
 */
export function walk(rootpath, cb, path_segments = []) {
	let fullpath = path.resolve(rootpath, ...path_segments);
	let dir_contents = fs.readdirSync(fullpath);
	for (let entry of dir_contents) {
		let entry_fullpath = path.resolve(rootpath, ...path_segments, entry);
		let stats = fs.statSync(entry_fullpath);

		let ignored_prefixes = [".", "_"];
		if (ignored_prefixes.find(p => entry.startsWith(p)) !== undefined) {
			continue;
		}

		if (stats.isDirectory()) walk(rootpath, cb, [...path_segments, entry]);
		else if (stats.isFile()) cb([...path_segments, entry]);
		else {
			console.log(`found something that's not dir or file: ${entry_fullpath}`);
		}
	}
}
