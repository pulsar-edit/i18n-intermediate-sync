// @ts-check
// Assuming this repo is checked out at `./sync` and Pulsar is at `./pulsar`
// Written for use in Pulsar CI

import season from "season";
import * as fs from "fs";
import * as path from "path";
import { walk } from "./lib.mjs";

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
	fs.mkdirSync(path.dirname(full_path_json), { recursive: true });
	fs.writeFileSync(full_path_json, JSON.stringify(parsed, null, "  ") + "\n");

	let relative_cson_file = path.join(relative_cson, ...path_segments);
	let relative_json_file = path.join(relative_json, ...path_segments);
	relative_json_file = relative_json_file.substring(0, relative_json_file.length - cson_ext_len) + json_ext;
	console.log(`${relative_cson_file} => ${relative_json_file}`);
});
