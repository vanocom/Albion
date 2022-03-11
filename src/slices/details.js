import { createSlice } from '@reduxjs/toolkit';
import { getItemPrice, getCraftItems, getResourcesCraftItems } from './async_thuks';
import {
  getCurrentCraftPrices,
  calculateCraftProfit,
  formattedCityPrices,
  fillExistingItem,
  fillProducedItemsCount
} from '../utils/utils';

const initialState = {
  details: [],
  onDetails: false
};

const findItem = (state, uniqueName) => state.details.find(item => item.uniqueName === uniqueName);

const itemPricePending = (state, meta) => {
  const itemExist = findItem(state, meta.arg);
  if (itemExist) {
    itemExist.priceLoading = true;
    itemExist.priceError = null;
    if (!state.onDetails) {
      state.details = state.details.filter(item => item.uniqueName === meta.arg);
    }
    return;
  }
  if (!state.onDetails) state.details = [];
  state.details.push({ uniqueName: meta.arg, priceLoading: true, priceError: null });
};

const itemPriceFullfilled = (state, payload) => {
  const { cityPrices, uniqueName } = payload;
  const itemExist = findItem(state, payload.uniqueName);
  if (itemExist) {
    itemExist.cityPrices = cityPrices;
    itemExist.priceLoading = false;
    itemExist.priceCheckDate = (new Date()).toString();
    if (!state.onDetails) {
      state.details = state.details.filter(item => item.uniqueName === payload.uniqueName);
    }
    return;
  }
  if (!state.onDetails) state.details = [];
  state.details.push({
    cityPrices,
    priceLoading: false,
    uniqueName,
    priceCheckDate: (new Date()).toString()
  });
};

const itemPriceRejected = (state, payload) => {
  const itemExist = findItem(state, payload.uniqueName);
  if (itemExist) {
    itemExist.priceLoading = false;
    itemExist.priceError = payload.errorMessage;
    if (!state.onDetails) {
      state.details = state.details.filter(item => item.uniqueName === payload.uniqueName);
    }
    return;
  }
  if (!state.onDetails) state.details = [];
  state.details.push({
    uniqueName: payload.uniqueName,
    priceLoading: false,
    priceError: payload.errorMessage
  });
};

// eslint-disable-next-line max-lines-per-function
const craftItemsPending = (state, meta) => {
  const uniqueName = meta.arg.uniqueName || meta.arg;
  const itemExist = findItem(state, uniqueName);
  if (itemExist) {
    itemExist.craftLoading = true;
    itemExist.craftError = null;
    itemExist.craftingRequirements = meta.arg.craftingRequirements;
    itemExist.craftProduce = meta.arg.craftProduce;
    itemExist.craftProduce1 = meta.arg.craftProduce1;
    itemExist.craftProduce2 = meta.arg.craftProduce2;
    itemExist.craftProduce3 = meta.arg.craftProduce3;
    itemExist.producedItemsCount = fillProducedItemsCount({ ...itemExist, ...meta.arg });
    itemExist.transmutationPrice = meta.arg.transmutationPrice;
    itemExist.kind = meta.arg.kind;
    if (!state.onDetails) {
      state.details = state.details.filter(item => item.uniqueName === uniqueName);
    }
    return;
  }
  if (!state.onDetails) state.details = [];
  state.details.push({
    uniqueName,
    craftLoading: true,
    craftError: null,
    craftingRequirements: meta.arg.craftingRequirements,
    craftProduce: meta.arg.craftProduce,
    craftProduce1: meta.arg.craftProduce1,
    craftProduce2: meta.arg.craftProduce2,
    craftProduce3: meta.arg.craftProduce3,
    producedItemsCount: fillProducedItemsCount(meta.arg),
    kind: meta.arg.kind,
    transmutationPrice: meta.arg.transmutationPrice
  });
};

const craftItemsRejected = (state, payload) => {
  const itemExist = findItem(state, payload.uniqueName);
  if (itemExist) {
    itemExist.craftLoading = false;
    itemExist.craftError = payload.errorMessage;
    if (!state.onDetails) {
      state.details = state.details.filter(item => item.uniqueName === payload.uniqueName);
    }
    return;
  }
  if (!state.onDetails) state.details = [];
  state.details.push({
    uniqueName: payload.uniqueName,
    craftLoading: false,
    craftError: payload.errorMessage
  });
};

const fullfillExistingItem = (state, payload, itemExist) => {
  state.details = state.details.map(detail => fillExistingItem(detail, payload, itemExist));
  if (!state.onDetails) {
    state.details = state.details.filter(item => item.uniqueName === payload.uniqueName);
  }
};

// eslint-disable-next-line max-lines-per-function
const craftItemsFullfilled = (state, payload) => {
  const itemExist = findItem(state, payload.uniqueName);
  if (itemExist) {
    fullfillExistingItem(state, payload, itemExist);
    return;
  }
  if (!state.onDetails) state.details = [];
  state.details.push({
    ...payload,
    craftLoading: false,
    cityPrices: formattedCityPrices(payload.prices, payload.uniqueName),
    returnRateCraftPrices: getCurrentCraftPrices(payload),
    returnRateProfit: calculateCraftProfit(payload),
    craftCheckDate: (new Date()).toString(),
    craftingRequirements: payload.craftingRequirements,
    activeReceipt: 0
  });
};

const detailsSlice = createSlice({
  name: 'details',
  initialState,
  reducers: {
    reset: () => initialState,
    setOnDetails(state, { payload }) {
      state.onDetails = state.details.length === 1 ? payload.onDetails : true;
      if (!payload.onDetails) {
        state.details = state.details.filter(item => item.uniqueName !== payload.uniqueName);
      }
    },
    changeItemReturnRate(state, action) {
      const item = findItem(state, action.payload.uniqueName);
      if (!item) return;
      item.returnRate = action.payload.returnRate;
      item.returnRateCraftPrices = getCurrentCraftPrices(item);
      item.returnRateProfit = calculateCraftProfit(item);
    },
    changeItemCraftTax(state, action) {
      const item = findItem(state, action.payload.uniqueName);
      if (!item) return;
      item.craftTax = action.payload.craftTax;
      item.returnRateCraftPrices = getCurrentCraftPrices(item);
      item.returnRateProfit = calculateCraftProfit(item);
    },
    changeActiveReceipt(state, action) {
      const { activeReceipt } = action.payload;
      const item = findItem(state, action.payload.uniqueName);
      if (!item) return;
      const craftItemsArr = Object.values(item.craftingRequirements);
      item.activeReceipt = activeReceipt;
      item.craftItems = craftItemsArr[activeReceipt];
      item.producedItemsCount = fillProducedItemsCount(item);
      item.returnRateCraftPrices = getCurrentCraftPrices(item);
      item.returnRateProfit = calculateCraftProfit(item);
    },
    changeProducedItemsCount(state, action) {
      const { uniqueName, count } = action.payload;
      const item = findItem(state, uniqueName);
      if (!item) return;
      item.userProducedItemsCount = count;
      item.totalProducedItemsCount = count * item.producedItemsCount;
      item.returnRateCraftPrices = getCurrentCraftPrices(item);
      item.returnRateProfit = calculateCraftProfit(item);
    }
  },
  // eslint-disable-next-line max-lines-per-function
  extraReducers: (builder) => {
    builder.addCase(getItemPrice.pending, (state, { meta }) => {
      itemPricePending(state, meta);
    });
    builder.addCase(getItemPrice.fulfilled, (state, { payload }) => {
      itemPriceFullfilled(state, payload);
    });
    builder.addCase(getItemPrice.rejected, (state, { payload }) => {
      itemPriceRejected(state, payload);
    });
    builder.addCase(getCraftItems.pending, (state, { meta }) => {
      craftItemsPending(state, meta);
    });
    builder.addCase(getCraftItems.rejected, (state, { payload }) => {
      craftItemsRejected(state, payload);
    });
    builder.addCase(getCraftItems.fulfilled, (state, { payload }) => {
      craftItemsFullfilled(state, payload);
    });
    builder.addCase(getResourcesCraftItems.pending, (state, { meta }) => {
      craftItemsPending(state, meta);
    });
    builder.addCase(getResourcesCraftItems.fulfilled, (state, { payload }) => {
      craftItemsFullfilled(state, payload);
    });
    builder.addCase(getResourcesCraftItems.rejected, (state, { payload }) => {
      craftItemsRejected(state, payload);
    });
  }
});

export const {
  reset,
  setOnDetails,
  changeItemReturnRate,
  changeItemCraftTax,
  changeActiveReceipt,
  changeProducedItemsCount
} = detailsSlice.actions;

export const selectDetails = (state) => state.details;

export default detailsSlice.reducer;
