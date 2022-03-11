const requestInfo = (method, params, controller) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: params || null,
  signal: controller.signal
});

export const makeRequest = async (method, path, params) => {
  try {
    global.devLog('REQUEST ---------> ', path);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const response = await fetch(path, requestInfo(method, params, controller));
    clearTimeout(timeoutId);
    const resContent = response.headers.map['content-type'].includes('application/json');
    if (resContent) {
      const json = await response.json();
      global.devLog('RESPONSE --------->', path, json);
      if (response.status >= 200 && response.status < 300) return json;
      throw new Error(json);
    }
    throw new Error(response.status.toString());
  } catch (error) {
    global.devLog('Error makeRequest:', error);
    throw error;
  }
};
