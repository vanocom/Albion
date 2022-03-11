import { createAsyncThunk } from '@reduxjs/toolkit';
import { Mixpanel } from 'mixpanel-react-native';
import { getUniqueId } from 'react-native-device-info';
import Config from 'react-native-config';
import { changeStorageData } from '../slices/async_thuks';

const mixpanel = new Mixpanel('c089832213e13e3ceeeaa66d55fcc65e');
mixpanel.init();

export const identifyUser = createAsyncThunk(
  'mixpanel/identifyUser',
  async (_, { getState, dispatch }) => {
    const { mixpanelAliasWasCreated } = getState().settings;
    if (!mixpanel) {
      global.devLog('Mixpanel instance was not initialized!');
      return;
    }
    const distinctId = await mixpanel.getDistinctId();
    const deviceId = getUniqueId();
    if (!mixpanelAliasWasCreated) {
      mixpanel.alias(deviceId, distinctId);
      dispatch(changeStorageData({ key: 'mixpanelAliasWasCreated', value: JSON.stringify(true) }));
    }
    mixpanel.identify(deviceId);
  }
);

export const trackMixpanelEvent = (name, properties) => (dispatch, getState) => {
  if (!mixpanel) {
    global.devLog('Mixpanel instance was not initialized on track event!');
    return;
  }
  const { currentLoc, actionsCount } = getState().settings;
  const env = Config.ENV === 'dev' ? 'Staging' : 'Production';
  mixpanel.registerSuperProperties({ Localization: currentLoc, 'Actions Count': actionsCount, Environment: env });
  mixpanel.track(name, properties);
  mixpanel.flush();
  global.devLog('Mixpanel track event:', name, properties);
};
