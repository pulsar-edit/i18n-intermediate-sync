// @ts-check

// Written for use in Pulsar CI
// This script assumes:
// - this is run at the root of this repo
// - the `cson` dir is up to date (updated cson files externally copied, ie. prev step in gha)
// - the `json` dir is emptied or nonexistent

import season from "season";
import * as fs from "fs";
import * as path from "path";
import { convert_file_ext, walk, cson_ext, json_ext } from "./lib.mjs";

let cson_dir_relative = "cson";
let json_dir_relative = "json";

let cson_dir_absolute = path.resolve(cson_dir_relative);
let json_dir_absolute = path.resolve(json_dir_relative);

fs.mkdirSync(json_dir_absolute, { recursive: true });

const accepted_src_exts = [cson_ext, json_ext];

walk(cson_dir_absolute, path_segments => {
	let cson_file_relative = path.join(cson_dir_relative, ...path_segments);
	let json_file_relative = path.join(json_dir_relative, ...path_segments);

	let cson_file_absolute = path.resolve(cson_file_relative);
	let json_file_absolute = path.resolve(json_file_relative);

	let temp = convert_file_ext(json_file_absolute, cson_ext, accepted_src_exts);
	if (!temp) return;
	json_file_absolute = temp;

	let parsed = season.readFileSync(cson_file_absolute);

	fs.mkdirSync(path.dirname(json_file_absolute), { recursive: true });
	fs.writeFileSync(json_file_absolute, JSON.stringify(parsed, null, "  ") + "\n");

	console.log(`${cson_file_relative} => ${json_file_relative}`);
});
