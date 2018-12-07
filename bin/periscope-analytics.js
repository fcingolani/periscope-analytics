#! /usr/bin/env node

"use strict";

const program = require('commander');
const tools = require('..');

program
  .version('0.1.0')

program
  .command('import-recent-broadcasts <user_name>')
  .action(function (userName) {
    tools.importRecentBroadcasts(userName);
  });

program
  .command('import-broadcast <broadcast_id>')
  .action(function (broadcastId) {
    tools.importBroadcast(broadcastId);
  });

program
  .command('export-broadcasts-csv <filename>')
  .action(function (filename) {
    tools.exportBroadcastsCSV(filename);
  });

program
  .command('*')
  .action(function (env) {
    console.error("Unknown command");
    program.help();
  });

program.parse(process.argv);

if (!program.args.length) program.help();