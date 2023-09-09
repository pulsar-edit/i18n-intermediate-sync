// @ts-check

import * as fs from "fs";
import * as path from "path";

const ignored_prefixes = [".", "_"];

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
		if (ignored_prefixes.find(p => entry.startsWith(p)) !== undefined) {
			continue;
		}

		let stats = fs.statSync(entry_fullpath);
		if (stats.isDirectory()) walk(rootpath, cb, [...path_segments, entry]);
		else if (stats.isFile()) cb([...path_segments, entry]);
		else {
			console.log(`found something that's not dir or file: ${entry_fullpath}`);
		}
	}
}

/**
 * @param {string} path
 * @param {string} to_ext
 * @param {Array<string>} accepted_exts
 */
export function convert_file_ext(path, to_ext, accepted_exts) {
	let ext_pos = path.lastIndexOf(".");

	if (ext_pos < 0) {
		console.log(`ignoring path without file extension: ${path}`);
		return;
	}

	let path_ext = path.substring(ext_pos + 1);
	let path_without_ext = path.substring(0, ext_pos);

	if (!accepted_exts.includes(path_ext)) {
		console.log(`ignoring path without accepted file extension: ${path}`);
		return;
	}

	let converted = path_without_ext + "." + to_ext;
	return converted;
}

export const cson_ext = "cson";
export const json_ext = "json";
