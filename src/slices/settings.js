import { createSlice } from '@reduxjs/toolkit';
import I18n from 'react-native-i18n';
import { changeStorageData, loadStorageData } from './async_thuks';
import { timeDifferenceDay } from '../utils/utils';

const kShowAppRateDays = 3;

const initialState = {
  currentLoc: '',
  maxPriceListCount: 5,
  maxCraftListCount: 5,
  adShowsAfterActions: 6,
  installDate: null,
  canShowAppRate: false,
  mixpanelAliasWasCreated: false,
  adLoaded: false,
  actionsCount: 0
};

const changeLocalization = (state, payload) => {
  I18n.locale = payload;
  state.currentLoc = payload;
};

const loadStorageDataFulfilled = (state, payload) => {
  if (payload.currentLoc) changeLocalization(state, payload.currentLoc);
  state.installDate = payload.installDate;
  const daysFromInstall = timeDifferenceDay(payload.installDate);
  state.canShowAppRate = daysFromInstall >= kShowAppRateDays;
  state.mixpanelAliasWasCreated = (payload.mixpanelAliasWasCreated === 'true');
  state.actionsCount = payload.actionsCount ? parseInt(payload.actionsCount, 10) : 0;
};

const changeStorageDataFulfilled = (state, payload) => {
  if (payload.key === 'currentLoc') {
    changeLocalization(state, payload.value);
  }
  if (payload.key === 'installDate') {
    state.installDate = payload.value;
    const daysFromInstall = timeDifferenceDay(payload.value);
    state.canShowAppRate = daysFromInstall >= kShowAppRateDays;
  }
  if (payload.key === 'mixpanelAliasWasCreated') {
    state.mixpanelAliasWasCreated = (payload.mixpanelAliasWasCreated === 'true');
  }
  if (payload.key === 'actionsCount') {
    state.actionsCount = parseInt(payload.value, 10);
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLocalization(state, action) {
      changeLocalization(state, action.payload);
    },
    setAdLoaded(state, action) {
      state.adLoaded = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadStorageData.fulfilled, (state, { payload }) => {
      loadStorageDataFulfilled(state, payload);
    });
    builder.addCase(changeStorageData.fulfilled, (state, { payload }) => {
      changeStorageDataFulfilled(state, payload);
    });
  }
});

export const {
  setLocalization,
  setAdLoaded
} = settingsSlice.actions;

export const selectSettings = (state) => state.settings;

export default settingsSlice.reducer;
