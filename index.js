#!/usr/bin/env node

const fs = require('fs-extra');

const { program } = require('commander');

const {
  enableMonitoring,
  getMonitoringData,
  disableMonitoring,
} = require('./lib');


const packageJSON = require('./package.json');
program.version(packageJSON.version, '-v, --version');

const DEFAULT_PROJECT = 'foundry-monitoring';
const DEFAULT_REGION = 'us-central1';
const DEFAULT_TAG = null;

// Use this function to allow repeated usage of flags
// function collect(val, memo) {
//   memo.push(val);
//   return memo;
// }

program
  .command('enable <functionName>')
  .option('-p, --project <project>', '', DEFAULT_PROJECT)
  .option('-r, --region <region>', '', DEFAULT_REGION)
  .option('-t, --tag <tag>', '', DEFAULT_TAG)
  .action(async (functionName, cmdObj) => {
    try {
      const ids = await enableMonitoring(
        functionName,
        cmdObj.project,
        cmdObj.region,
        cmdObj.tag,
      );

      if (ids.length > 0) {
        console.log(`Enabled function "${functionName}" monitoring`);
      } else {
        console.log(`Function "${functionName}" monitoring is already enabled`);
      }
    } catch (error) {
      console.error(error.message);
    }
  })

program
  .command('disable <functionName>')
  .option('-p, --project <project>', '', DEFAULT_PROJECT)
  .option('-r, --region <region>', '', DEFAULT_REGION)
  .option('-t, --tag <tag>', '', DEFAULT_TAG)
  .action(async (functionName, cmdObj) => {
    try {
      const ids = await disableMonitoring(
        functionName,
        cmdObj.project,
        cmdObj.region,
        cmdObj.tag,
      );

      if (ids.length > 0) {
        console.log(`Disabled function "${functionName}" monitoring`);
      } else {
        console.log(`Function "${functionName}" monitoring is already disabled`);
      }
    } catch (error) {
      console.error(error.message);
    }
  })

// TODO: Add command for listing all functions available for monitoring
// program
//   .command('list')
//   .action(async () => {
//     try {
//       const monitorableFunctions = await getMonitorableFunctions();
//       console.log('Functions deployed in the monitoring project:');
//       monitorableFunctions.forEach((fn) => {
//         console.log(`  ${fn}`);
//       });
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   })

program
  .command('data [functionName]')
  .option('-p, --project <project>', '', DEFAULT_PROJECT)
  .option('-r, --region <region>', '', DEFAULT_REGION)
  .option('-t, --tag <tag>', '', DEFAULT_TAG)
  .option('-f, --file <file>')
  .option('-n, --no-default', 'Stops using default project and region and queries for all the data.')
  .action(async (functionName, cmdObj) => {
    try {
      const data = await getMonitoringData(
        functionName,
        cmdObj.default ? undefined : cmdObj.project,
        cmdObj.default ? undefined : cmdObj.region,
        cmdObj.default ? undefined : cmdObj.tag,
      );

      if (cmdObj.file) {
        fs.writeJSONSync(cmdObj.file, data);
        console.log(`Data (${data.length} entries) successfully written to the file on the path "${cmdObj.file}"`);
      } else {
        console.log('\nDisplaying selected monitoring data:');
        data.forEach((entry) => {
          console.log(`  Name: ${entry.fn.functionName}\n  ProjectId: ${entry.fn.projectId}\n  Region: ${entry.fn.region}\n  Tag: ${entry.fn.tag}\n  Pinging enabled: ${entry.fn.enabled}\n  Pings:`);
          entry.pings.forEach((ping) => {
            console.log(`    ${new Date(ping.timestamp).toUTCString()} - ${ping.responseDuration}ms`);
          })
          console.log();
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  })


program.parse(process.argv);
