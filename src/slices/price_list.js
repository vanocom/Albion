import { createSlice } from '@reduxjs/toolkit';
import { formattedCityPrices } from '../utils/utils';
import {
  changePriceList, getItemPricesByIds,
  createItemsByUniqueNames, loadStorageData, getItemPrice
} from './async_thuks';

const initialState = {
  items: [],
  itemUniqueNames: [],
  itemsPrice: [],
  itemsType: 'PRICE',
  loading: false,
  error: false,
  errorMessage: ''
};

const getItemsPriceFulfilled = (state, payload) => {
  state.items = state.items.map(item => ({
    ...item,
    cityPrices: formattedCityPrices(payload.cityPrices, item.uniqueName)
  }));
  state.cityPrices = payload;
  state.loading = false;
};

const getItemPricesByIdsExtraReducers = (builder) => {
  builder.addCase(getItemPricesByIds.fulfilled, (state, actions) => {
    getItemsPriceFulfilled(state, actions.payload);
  });
  builder.addCase(getItemPricesByIds.pending, (state) => {
    state.loading = true;
    state.error = false;
    state.errorMessage = '';
  });
  builder.addCase(getItemPricesByIds.rejected, (state, { payload }) => {
    state.loading = false;
    state.error = true;
    state.errorMessage = payload.errorMessage;
  });
};

const getItemPriceExtraReducers = (builder) => {
  builder.addCase(getItemPrice.fulfilled, (state, actions) => {
    const item = state.items.find(it => it.uniqueName === actions.meta.arg);
    if (!item) return;
    item.cityPrices = actions.payload.cityPrices;
    item.loading = false;
  });
  builder.addCase(getItemPrice.pending, (state, actions) => {
    const item = state.items.find(it => it.uniqueName === actions.meta.arg);
    if (!item) return;
    item.loading = true;
    item.errorMessage = null;
  });
  builder.addCase(getItemPrice.rejected, (state, { payload }) => {
    const item = state.items.find(it => it.uniqueName === payload.uniqueName);
    if (!item) return;
    item.loading = false;
    item.errorMessage = payload.errorMessage;
  });
};

const createItemsExtraReducers = (builder) => {
  builder.addCase(createItemsByUniqueNames.fulfilled, (state, actions) => {
    if (actions.payload.typeFor === 'PriceList' && actions.payload.items.length > 0) state.items = state.items.concat(actions.payload.items);
  });
};

const changePriceListExtraReducers = (builder) => {
  builder.addCase(changePriceList.fulfilled, (state, { payload }) => {
    state.itemUniqueNames = payload;
    state.items = state.itemUniqueNames.length === 0
      ? [] : state.items.filter(item => state.itemUniqueNames.includes(item.uniqueName));
  });
  builder.addCase(changePriceList.rejected, () => {
  });
};

const storageExtraReducers = (builder) => {
  builder.addCase(loadStorageData.fulfilled, (state, { payload }) => {
    state.itemUniqueNames = payload.priceUniqueNames ? payload.priceUniqueNames : [];
  });
};

const tabPriceSlice = createSlice({
  name: 'tabPrice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    getItemPricesByIdsExtraReducers(builder);
    getItemPriceExtraReducers(builder);
    createItemsExtraReducers(builder);
    changePriceListExtraReducers(builder);
    storageExtraReducers(builder);
  }
});

export const selectPrice = (state) => state.priceList;

export default tabPriceSlice.reducer;
