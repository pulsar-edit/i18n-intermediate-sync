// @ts-check
// Assuming this repo is checked out at `./sync` and Pulsar is at `./pulsar`
// Written for use in Pulsar CI

import season from "season";
import * as fs from "fs";
import * as path from "path";
import { walk } from "./lib.mjs";

let relative_json = "json-translated";
let relative_cson = "cson-translated";
let json = path.resolve(relative_json);
let cson = path.resolve(relative_cson);
fs.mkdirSync(json, { recursive: true });
fs.mkdirSync(cson, { recursive: true });

let json_ext_len = ".json".length;
let cson_ext = ".cson"

walk(json, path_segments => {
	const full_path_json = path.resolve(json, ...path_segments);
	let full_path_cson = path.resolve(cson, ...path_segments);
	full_path_cson = full_path_cson.substring(0, full_path_cson.length - json_ext_len) + cson_ext;

	let file = fs.readFileSync(full_path_json, "utf8");
	let parsed = JSON.parse(file);
	fs.mkdirSync(path.dirname(full_path_cson), { recursive: true });
	let stringified = season.stringify(parsed).trimEnd() + "\n";
	fs.writeFileSync(full_path_cson, stringified);

	let relative_json_file = path.join(relative_json, ...path_segments);
	let relative_cson_file = path.join(relative_cson, ...path_segments);
	relative_cson_file = relative_cson_file.substring(0, relative_cson_file.length - json_ext_len) + cson_ext;
	console.log(`${relative_json_file} => ${relative_cson_file}`);
});
