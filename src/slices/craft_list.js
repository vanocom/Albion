import { createSlice } from '@reduxjs/toolkit';
import {
  calculateCraftProfit, getCurrentCraftPrices, formattedCityPrices,
  fillExistingItem, fillProducedItemsCount
} from '../utils/utils';
import {
  getCraftItemsByIds, loadStorageData, changeCraftList,
  getCraftItems, createItemsByUniqueNames, getResourcesCraftItems
} from './async_thuks';

const initialState = {
  items: [],
  itemUniqueNames: [],
  itemsCraftPrice: [],
  itemsType: 'CRAFT',
  loading: false,
  error: false,
  errorMessage: ''
};

const changeCraftListFulfilled = (state, payload) => {
  state.itemUniqueNames = payload;
  state.items = state.itemUniqueNames.length === 0
    ? [] : state.items.filter(item => state.itemUniqueNames.includes(item.uniqueName));
};

const findItem = (state, uniqueName) => state.items.find(item => item.uniqueName === uniqueName);

const fullfillExistingItem = (state, payload, itemExist) => {
  state.items = state.items.map(item => fillExistingItem(item, payload, itemExist));
};

const getCraftItemsFullfilled = (state, payload) => {
  const itemExist = findItem(state, payload.uniqueName);
  if (itemExist) {
    fullfillExistingItem(state, payload, itemExist);
  }
};

const getItemPricesByIdsFulfilled = (state, payload) => {
  state.items = state.items.map(item => ({
    ...Object.assign(item, payload.find(e => item.uniqueName ===  e.uniqueName)),
    loading: false,
    cityPrices: formattedCityPrices(item.prices, item.uniqueName),
    returnRateCraftPrices: getCurrentCraftPrices(item),
    returnRateProfit: calculateCraftProfit(item)
  }));
  state.loading = false;
};

const getCraftItemsPending = (state, meta) => {
  const uniqueName = meta.arg.uniqueName || meta.arg;
  const item = state.items.find(obj => obj.uniqueName === uniqueName);
  if (!item) return;
  item.errorMessage = null;
  item.loading = true;
  item.errorMessage = null;
};

const createItemsExtraReducers = (builder) => {
  builder.addCase(createItemsByUniqueNames.fulfilled, (state, actions) => {
    if (actions.payload.typeFor === 'CraftList') state.items = state.items.concat(actions.payload.items);
  });
};

const changeCraftListExtraReducers = (builder) => {
  builder.addCase(changeCraftList.fulfilled, (state, { payload }) => {
    changeCraftListFulfilled(state, payload);
  });
};

const storagesExtraReducers = (builder) => {
  builder.addCase(loadStorageData.fulfilled, (state, { payload }) => {
    state.itemUniqueNames = payload.craftUniqueNames ? payload.craftUniqueNames : [];
  });
};

const craftExtraReducers = (builder) => {
  builder.addCase(getCraftItems.fulfilled, (state, actions) => {
    getCraftItemsFullfilled(state, actions.payload);
  });
  builder.addCase(getCraftItems.pending, (state, actions) => {
    getCraftItemsPending(state, actions.meta);
  });
  builder.addCase(getCraftItems.rejected, (state, { payload }) => {
    const item = state.items.find(obj => obj.uniqueName === payload.uniqueName);
    if (!item) return;
    item.errorMessage = payload.errorMessage;
    item.loading = false;
  });
};

const resourcesCraftExtraReducers = (builder) => {
  builder.addCase(getResourcesCraftItems.fulfilled, (state, actions) => {
    getCraftItemsFullfilled(state, actions.payload);
  });
  builder.addCase(getResourcesCraftItems.pending, (state, actions) => {
    getCraftItemsPending(state, actions.meta);
  });
  builder.addCase(getResourcesCraftItems.rejected, (state, { payload }) => {
    const item = state.items.find(obj => obj.uniqueName === payload.uniqueName);
    if (!item) return;
    item.errorMessage = payload.errorMessage;
    item.loading = false;
  });
};

const craftItemsByIdsExtraReducers = (builder) => {
  builder.addCase(getCraftItemsByIds.fulfilled, (state, actions) => {
    getItemPricesByIdsFulfilled(state, actions.payload);
  });
  builder.addCase(getCraftItemsByIds.pending, (state) => {
    state.loading = true;
    state.error = false;
    state.errorMessage = '';
  });
  builder.addCase(getCraftItemsByIds.rejected, (state, { payload }) => {
    state.loading = false;
    state.error = true;
    state.errorMessage = payload.errorMessage;
  });
};

const craftSlice = createSlice({
  name: 'craft',
  initialState,
  reducers: {
    changeItemReturnRate(state, action) {
      const item = findItem(state, action.payload.uniqueName);
      item.returnRate = action.payload.returnRate;
      item.returnRateCraftPrices = getCurrentCraftPrices(item);
      item.returnRateProfit = calculateCraftProfit(item);
    },
    changeItemCraftTax(state, action) {
      const item = findItem(state, action.payload.uniqueName);
      item.craftTax = action.payload.craftTax;
      item.returnRateCraftPrices = getCurrentCraftPrices(item);
      item.returnRateProfit = calculateCraftProfit(item);
    },
    changeActiveReceipt(state, action) {
      const { activeReceipt } = action.payload;
      const item = findItem(state, action.payload.uniqueName);
      const craftItemsArr = Object.values(item.craftingRequirements);
      item.activeReceipt = activeReceipt;
      item.craftItems = craftItemsArr[activeReceipt];
      item.producedItemsCount = fillProducedItemsCount(item);
      item.returnRateCraftPrices = getCurrentCraftPrices(item);
      item.returnRateProfit = calculateCraftProfit(item);
    },
    changeProducedItemsCount(state, action) {
      const item = findItem(state, action.payload.uniqueName);
      item.userProducedItemsCount = action.payload.count;
      item.totalProducedItemsCount = action.payload.count * item.producedItemsCount;
      item.returnRateCraftPrices = getCurrentCraftPrices(item);
      item.returnRateProfit = calculateCraftProfit(item);
    }
  },

  extraReducers: (builder) => {
    createItemsExtraReducers(builder);
    changeCraftListExtraReducers(builder);
    storagesExtraReducers(builder);
    craftExtraReducers(builder);
    resourcesCraftExtraReducers(builder);
    craftItemsByIdsExtraReducers(builder);
  }
});

export const {
  changeItemReturnRate,
  changeItemCraftTax,
  changeActiveReceipt,
  changeProducedItemsCount
} = craftSlice.actions;

export const selectCraft = (state) => state.craftList;

export default craftSlice.reducer;
