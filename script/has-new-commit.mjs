// @ts-check
// Assuming this repo is checked out at `./sync` and Pulsar is at `./pulsar`
// Written for use in Pulsar CI

import * as cp from "child_process";
import * as path from "path";

let sync = path.resolve("./sync");
let pulsar = path.resolve("./pulsar");

let sync_commit_message = cp.execSync("git show -s --format=%B $(git rev-parse HEAD)", { cwd: sync }).toString().trim();
let pulsar_commit = cp.execSync("git rev-parse HEAD", { cwd: pulsar }).toString().trim();

let has_new = !sync_commit_message.includes(`(automated) updating JSON files from pulsar-edit/pulsar@${pulsar_commit}`);
console.log(`has-new=${has_new}`);
console.log(`pulsar-commit=${pulsar_commit}`);
