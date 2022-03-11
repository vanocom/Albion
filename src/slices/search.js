import { createSlice } from '@reduxjs/toolkit';
import {
  calculateCraftProfit,
  getCurrentCraftPrices,
  formattedCityPrices,
  fillProducedItemsCount
} from '../utils/utils';
import {
  filterSearchResults, getCraftItems, getItemPrice,
  changeStorageData, loadStorageData, getResourcesCraftItems
} from './async_thuks';

const initialState = {
  items: [],
  loading: false,
  suggestedItems: [],
  tier: { value: null, displayValue: 'any' },
  ench: { value: null, displayValue: 'any' },
  quality: { value: null, displayValue: 'any' },
  searchText: '',
  savedUniqueNamesInPriceList: [],
  savedUniqueNamesInCraftList: [],
  updatedItemIndex: 0,
  modifiedItemCellType: '',
  scrollToItem: false
};

const setUpdatedItem = (state, item) => {
  if (!state.scrollToItem) return;
  state.updatedItemIndex = state.items.findIndex(obj => obj === item);
  state.modifiedItemCellType = item.type;
  state.scrollToItem = false;
};

const filterSearchResultsFulfilled = (state, payload) => {
  state.loading = false;
  state.items = payload.searchItems || [];
  state.suggestedItems = payload.suggestedItems || [];
  state.searchText = payload.searchText;
};

const getItemPriceFulfilled = (state, payload) => {
  const item = state.items.find(obj => obj.uniqueName === payload.uniqueName);
  if (!item) return;
  item.uniqueName = payload.uniqueName;
  item.cityPrices = payload.cityPrices;
  item.errorMessage = null;
  item.priceLoading = false;
  const dateNow = new Date();
  item.priceCheckDate = dateNow.toString();
  setUpdatedItem(state, item);
};

const getCraftItemsPending = (state, meta) => {
  const uniqueName = meta.arg.uniqueName || meta.arg;
  const item = state.items.find(obj => obj.uniqueName === uniqueName);
  if (!item) return;
  item.errorMessage = null;
  item.craftLoading = true;
  item.type = 'CRAFT';
};

const getCraftItemsRejected = (state, payload) => {
  const { errorMessage, uniqueName } = payload;
  const item = state.items.find(obj => obj.uniqueName === uniqueName);
  if (!item) return;
  item.errorMessage = errorMessage;
  item.craftLoading = false;
  setUpdatedItem(state, item);
};

const getItemPricePending = (state, meta) => {
  const item = state.items.find(obj => obj.uniqueName === meta.arg);
  if (!item) return;
  item.errorMessage = null;
  item.priceLoading = true;
  item.type = 'PRICE';
};

const getChangedUniqueName = (array1, array2) => {
  let isAdded;
  let foundUniqueNames;
  if (array1.length > array2.length) {
    foundUniqueNames = array1.filter(e => !array2.includes(e));
    isAdded = false;
  } else {
    foundUniqueNames = array2.filter(e => !array1.includes(e));
    isAdded = true;
  }
  return { uniqueName: foundUniqueNames[0], value: isAdded };
};

const changePresenceInLists = (state, payload) => {
  const value = JSON.parse(payload.value);
  let item; let foundValue;
  switch (payload.key) {
    case 'priceListUniqueNames':
      foundValue = getChangedUniqueName(state.savedUniqueNamesInPriceList, value);
      item = state.items.find(e => e.uniqueName === foundValue.uniqueName);
      if (item) item.savedInPriceList = foundValue.value;
      state.savedUniqueNamesInPriceList = value; break;
    case 'craftListUniqueNames':
      foundValue = getChangedUniqueName(state.savedUniqueNamesInCraftList, value);
      item = state.items.find(e => e.uniqueName === foundValue.uniqueName);
      if (item) item.savedInCraftList = foundValue.value;
      state.savedUniqueNamesInCraftList = value;
      break;
    default: break;
  }
};

const getCraftItemsFulfilled = (state, payload) => {
  let item = state.items.find(obj => obj.uniqueName === payload.uniqueName);
  if (!item) return;
  item = {
    ...item,
    ...payload,
    type: 'CRAFT',
    returnRateCraftPrices: getCurrentCraftPrices({ ...item, ...payload }),
    returnRateProfit: calculateCraftProfit({ ...item, ...payload }),
    craftLoading: false,
    craftCheckDate: (new Date()).toString(),
    errorMessage: null,
    cityPrices: formattedCityPrices(payload.prices, payload.uniqueName),
    craftingRequirements: payload.craftingRequirements || item.craftingRequirements
  };
  state.items = state.items.map(lItem => (lItem.uniqueName === item.uniqueName ? item : lItem));
  setUpdatedItem(state, item);
};

const setLocalization = (state) => {
  state.items = [];
  state.suggestedItems = [];
  state.searchText = '';
};

const searchExtraReducers = (builder) => {
  builder.addCase(filterSearchResults.pending, (state) => { state.loading = true; });
  builder.addCase(filterSearchResults.fulfilled, (state, { payload }) => {
    filterSearchResultsFulfilled(state, payload);
  });
  builder.addCase(filterSearchResults.rejected, () => { });
};

const pricingExtraReducers = (builder) => {
  builder.addCase(getItemPrice.fulfilled, (state, { payload }) => {
    getItemPriceFulfilled(state, payload);
  });
  builder.addCase(getItemPrice.pending, (state, { meta }) => {
    getItemPricePending(state, meta);
  });
  builder.addCase(getItemPrice.rejected, (state, { payload }) => {
    const { errorMessage, uniqueName } = payload;
    const item = state.items.find(obj => obj.uniqueName === uniqueName);
    if (!item) return;
    item.errorMessage = errorMessage;
    item.priceLoading = false;
    setUpdatedItem(state, item);
  });
};

const craftExtraReducers = (builder) => {
  builder.addCase(getCraftItems.fulfilled, (state, { payload }) => {
    getCraftItemsFulfilled(state, payload);
  });
  builder.addCase(getCraftItems.pending, (state, { meta }) => {
    getCraftItemsPending(state, meta);
  });
  builder.addCase(getCraftItems.rejected, (state, { payload }) => {
    getCraftItemsRejected(state, payload);
  });
};

const resourceCraftExtraReducers = (builder) => {
  builder.addCase(getResourcesCraftItems.fulfilled, (state, { payload }) => {
    getCraftItemsFulfilled(state, payload);
  });
  builder.addCase(getResourcesCraftItems.pending, (state, { meta }) => {
    getCraftItemsPending(state, meta);
  });
  builder.addCase(getResourcesCraftItems.rejected, (state, { payload }) => {
    getCraftItemsRejected(state, payload);
  });
};

const storageExtraReducers = (builder) => {
  builder.addCase(loadStorageData.fulfilled, (state, { payload }) => {
    state.savedUniqueNamesInPriceList = payload.priceUniqueNames ? payload.priceUniqueNames : [];
    state.savedUniqueNamesInCraftList = payload.craftUniqueNames ? payload.craftUniqueNames : [];
  });
  builder.addCase(changeStorageData.fulfilled, (state, { payload }) => {
    if (payload.key === 'priceListUniqueNames' || payload.key === 'craftListUniqueNames') changePresenceInLists(state, payload);
  });
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    searchStarted(state) {
      state.loading = true;
    },
    setTier(state, action) {
      state.tier = action.payload;
    },
    setEnch(state, action) {
      state.ench = action.payload;
    },
    scrollToItem(state) {
      state.scrollToItem = true;
    },
    setQuality(state, action) {
      state.quality = action.payload;
    },
    changeItemType(state, action) {
      const { uniqueName, itemType } = action.payload;
      const item = state.items.find(obj => obj.uniqueName === uniqueName);
      item.type = itemType;
      setUpdatedItem(state, item);
    },
    changeItemReturnRate(state, action) {
      const { returnRate, uniqueName } = action.payload;
      const item = state.items.find(obj => obj.uniqueName === uniqueName);
      item.returnRate = returnRate;
      item.returnRateCraftPrices = getCurrentCraftPrices(item);
      item.returnRateProfit = calculateCraftProfit(item);
    },
    changeItemCraftTax(state, action) {
      const { uniqueName, craftTax } = action.payload;
      const item = state.items.find(obj => obj.uniqueName === uniqueName);
      item.craftTax = craftTax;
      item.returnRateCraftPrices = getCurrentCraftPrices(item);
      item.returnRateProfit = calculateCraftProfit(item);
    },
    changeActiveReceipt(state, action) {
      const { uniqueName, activeReceipt } = action.payload;
      const item = state.items.find(obj => obj.uniqueName === uniqueName);
      const craftItemsArr = Object.values(item.craftingRequirements);
      item.activeReceipt = activeReceipt;
      item.craftItems = craftItemsArr[activeReceipt];
      item.producedItemsCount = fillProducedItemsCount(item);
      item.returnRateCraftPrices = getCurrentCraftPrices(item);
      item.returnRateProfit = calculateCraftProfit(item);
    },
    changeProducedItemsCount(state, action) {
      const { uniqueName, count } = action.payload;
      const item = state.items.find(obj => obj.uniqueName === uniqueName);
      item.userProducedItemsCount = count;
      item.totalProducedItemsCount = count * item.producedItemsCount;
      item.returnRateCraftPrices = getCurrentCraftPrices(item);
      item.returnRateProfit = calculateCraftProfit(item);
    }
  },
  // eslint-disable-next-line max-lines-per-function
  extraReducers: (builder) => {
    searchExtraReducers(builder);
    pricingExtraReducers(builder);
    craftExtraReducers(builder);
    resourceCraftExtraReducers(builder);
    storageExtraReducers(builder);
    builder.addCase('settings/setLocalization', (state) => { setLocalization(state); });
  }
});

export const {
  searchStarted,
  setTier,
  setEnch,
  setQuality,
  scrollToItem,
  changeItemReturnRate,
  changeItemType,
  changeItemCraftTax,
  changeActiveReceipt,
  changeProducedItemsCount
} = searchSlice.actions;

export const selectSearch = (state) => state.search;

export default searchSlice.reducer;
