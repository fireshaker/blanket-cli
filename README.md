# Monitoring CLI

## Installation
`$ npm i -g @foundryapp/monitoring-cli`

## CLI Usage 

### Enable monitoring of a function

`$ monitoring enable <functionName>`
This enables monitoring of function `<functionName>` deployed in the default project (`foundry-monitoring`) and default region (`us-central1`).

If you want to monitor function deployed in a different project then use the `-p` (`--project`) flag followed by the `<projectId>`.
`$ monitoring enable <functionName> -p <projectId>`

If you want to monitor function deployed in a different [region](https://cloud.google.com/functions/docs/locations) then use the `-r` (`--region`) flag followed by the region `<region>`.
`$ monitoring enable <functionName> -r <region>`

If you want to group functions to custom groups so you can later retrieve their data together then use the `-t` (`--tag`) flag followed by a tag `<tag>`. This is also a good place to specify the optimization you are testing. Currently a function monitoring can have only one tag.
`$ monitoring enable <functionName> -t <tag>`

You use use these flags together.
`$ monitoring enable <functionName> -p <projectId> -r <region> -t <tag>`


### Disable monitoring of a function

`$ monitoring disable <functionName>`
This disables monitoring of function `<functionName>` deployed in the default project (`foundry-monitoring`) and default region (`us-central1`).

If you want to disable monitoring of a function deployed in a different project then use the `-p` (`--project`) flag followed by the `<projectId>`.
`$ monitoring disable <functionName> -p <projectId>`

If you want to disable monitoring of a function deployed in a different [region](https://cloud.google.com/functions/docs/locations) then use the `-r` (`--region`) flag followed by the region `<region>`.
`$ monitoring disable <functionName> -r <region>`

If you used a tag when enabling a function you need to add the `-t` (`--tag`) flag followed by the same tag `<tag>` you used to disable that function.
`$ monitoring enable <functionName> -t <tag>`

You use use these flags together.
`$ monitoring disable <functionName> -p <projectId> -r <region> -t <tag>`


### Get monitoring data

`$ monitoring data`
This command will retrieve and print all saved monitoring data for functions deployed in the default project (`foundry-monitoring`) and default region (`us-central1`).

If you want to retrieve all the data regardless of a project and region use the `-n` (`--no-default`) tag.
`$ monitoring data -n`

If you want to retrieve data for a specific function add the `[functionName]` as an argument to get a query for the specified `[functionName]`.
`$ monitoring data [functionName]`

If you want to retrive only data of functions from a specific project then use the `-p` (`--project`) flag followed by the `<projectId>` to query for the specified `<projectId>`.
`$ monitoring data -p <projectId>`

If you want to retrive only data of functions from a specific [region](https://cloud.google.com/functions/docs/locations) then use the `-r` (`--region`) flag followed by the `<region>` to query for the specified `<region>`.
`$ monitoring data -r <region>`

If you want to retrieve only data of functions with a specific tag then use the `-t` (`--tag`) flag followed by the `<tag>` to query for the specified `<tag>`.
`$ monitoring data -t <tag>`

If you want to save the retrieved data as a JSON file then add the `-f` (`--file`) flag followed by a file path `<file>`.
`$ monitoring data -f <file>`
The saved data structure adhers to the following schema:
`
[{
    fn: {
        enabled: boolean;
        functionName: string;
        functionUrl?: string;
        tag?: string;
        region: string;
        projectId: string;
    },
    pings: [{
        responseDuration: number; // in ms
        timestamp: number; // as milliseconds since the epoch
    }],
}]
`
The pings are ordered in an ascending order by their timestamps.

You can use and combine the argument and the flags to make specific queries.


## API Usage

You can use this as a library in the code like this:

`$ npm i @foundryapp/monitoring-cli`

`const monitoring = require('@foundryapp/monitoring-cli')`
`// use monitoring.enableMonitoring, monitoring.disableMonitoring, monitoring.getMonitoringData`
