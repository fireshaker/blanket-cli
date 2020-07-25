const axios = require('axios').default;


function getFunctionUrl(region, projectId, functionName) {
  return `https://${region}-${projectId}.cloudfunctions.net/${functionName}`
}

async function enableMonitoring(functionName, projectId, region, tag, isBackground) {
  try {
    const result = await axios.post('https://us-central1-foundry-monitoring.cloudfunctions.net/monitoredFunction', {
      functionName,
      projectId,
      region,
      tag,
      enabled: true,
      ...!isBackground && { functionUrl: getFunctionUrl(region, projectId, functionName) },
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return result.data.monitoringIds;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function disableMonitoring(functionName, projectId, region, tag) {
  try {
    const result = await axios.post('https://us-central1-foundry-monitoring.cloudfunctions.net/monitoredFunction', {
      functionName,
      projectId,
      region,
      tag,
      enabled: false,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return result.data.monitoringIds;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function getMonitoringData(functionName, projectId, region, tag) {
  try {
    const result = await axios.post('https://us-central1-foundry-monitoring.cloudfunctions.net/monitoringData', {
      functionName,
      projectId,
      region,
      tag,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return result.data.data;
  } catch (error) {
    console.error(error.response.data);
    throw new Error(error.response.data.message);
  }
}

exports.getMonitoringData = getMonitoringData;
exports.disableMonitoring = disableMonitoring;
exports.enableMonitoring = enableMonitoring;
