import { createSlice } from '@reduxjs/toolkit';
import { loadStorageData, changeStorageData } from './async_thuks';

const initialState = {
  priceListUniqueNames: [],
  craftListUniqueNames: [],
  installDate: null,
  mixpanelAliasWasCreated: null,
  startPopupWasShowed: null,
  loaded: false,
  actionsCount: 0
};

const loadStorageDataFulfilled = (state, payload) => {
  state.priceListUniqueNames = payload.priceUniqueNames || [];
  state.craftListUniqueNames = payload.craftUniqueNames || [];
  state.installDate = payload.installDate;
  state.startPopupWasShowed = payload.startPopupWasShowed;
  state.loaded = true;
  state.actionsCount = payload.actionsCount;
};

// eslint-disable-next-line max-lines-per-function
const changeStorageDataFulfilled = (state, payload) => {
  switch (payload.key) {
    case 'priceListUniqueNames':
      state.priceListUniqueNames = JSON.parse(payload.value) || [];
      break;
    case 'craftListUniqueNames':
      state.craftListUniqueNames = JSON.parse(payload.value) || [];
      break;
    case 'currentLoc':
      state.currentLoc = payload.value;
      break;
    case 'installDate':
      state.installDate = payload.value;
      break;
    case 'actionsCount':
      state.actionsCount = payload.value;
      break;
    default:
      break;
  }
};

const Storage = createSlice({
  name: 'storage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadStorageData.fulfilled, (state, { payload }) => {
      loadStorageDataFulfilled(state, payload);
    });
    builder.addCase(loadStorageData.rejected, () => {
    });
    builder.addCase(changeStorageData.fulfilled, (state, { payload }) => {
      changeStorageDataFulfilled(state, payload);
    });
  }
});

export const selectStorage = (state) => state.storage;

export default Storage.reducer;
