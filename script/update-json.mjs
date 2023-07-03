// @ts-check
// Assuming this repo is checked out at `./sync` and Pulsar is at `./pulsar`
// Written for use in Pulsar CI

import season from "season";
import * as fs from "fs";
import * as path from "path";

let relative_cson = "cson";
let relative_json = "json";
let cson = path.resolve(relative_cson);
let json = path.resolve(relative_json);
fs.mkdirSync(cson, { recursive: true });
fs.mkdirSync(json, { recursive: true });

let cson_ext_len = ".cson".length;
let json_ext = ".json";

walk(cson, path_segments => {
	const full_path_cson = path.resolve(cson, ...path_segments);
	let full_path_json = path.resolve(json, ...path_segments);
	full_path_json = full_path_json.substring(0, full_path_json.length - cson_ext_len) + json_ext;

	let parsed = season.readFileSync(full_path_cson);
	fs.writeFileSync(full_path_json, JSON.stringify(parsed, null, "  ") + "\n");

	let relative_cson_file = path.join(relative_cson, ...path_segments);
	let relative_json_file = path.join(relative_json, ...path_segments);
	relative_json_file = relative_json_file.substring(0, relative_json_file.length - cson_ext_len) + json_ext;
	console.log(`${relative_cson_file} => ${relative_json_file}`);
});

/**
 * @param {string} rootpath
 * @param {(path_segments: Array<string>) => void} cb
 * @param {Array<string>} path_segments
 */
function walk(rootpath, cb, path_segments = []) {
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
