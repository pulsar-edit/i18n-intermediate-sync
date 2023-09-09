// @ts-check

// Written for use in Pulsar CI
// This script assumes:
// - this is run at the root of this repo
// - the `json-translated` dir is up to date (updated json files externally copied, ie. via crowdin PR)
// - the `cson-translated` dir is emptied or nonexistent

import season from "season";
import * as fs from "fs";
import * as path from "path";
import { convert_file_ext, walk, json_ext, cson_ext } from "./lib.mjs";

let json_dir_relative = "json-translated";
let cson_dir_relative = "cson-translated";

let json_dir_absolute = path.resolve(json_dir_relative);
let cson_dir_absolute = path.resolve(cson_dir_relative);

fs.mkdirSync(cson_dir_absolute, { recursive: true });

const accepted_src_exts = [json_ext];

walk(json_dir_absolute, path_segments => {
	let json_file_relative = path.join(json_dir_relative, ...path_segments);
	let cson_file_relative = path.join(cson_dir_relative, ...path_segments);

	let json_file_absolute = path.resolve(json_file_relative);
	let cson_file_absolute = path.resolve(cson_file_relative);

	let temp = convert_file_ext(cson_file_absolute, cson_ext, accepted_src_exts);
	if (!temp) return;
	cson_file_absolute = temp;

	let parsed = JSON.parse(fs.readFileSync(json_file_absolute, "utf8"));

	fs.mkdirSync(path.dirname(cson_file_absolute), { recursive: true });
	fs.writeFileSync(cson_file_absolute, season.stringify(parsed).trimEnd() + "\n");

	console.log(`${json_file_relative} => ${cson_file_relative}`);
});
