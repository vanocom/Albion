/* eslint-disable max-lines */
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Rate, { AndroidMarket } from 'react-native-rate';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { makeRequest } from '../utils/api';
import {
  formattedCityPrices,
  getCraftItemsIds,
  getCraftResourcesInfo,
  getCurrentCraftPrices,
  itemSatisfySearchQuery,
  fillSuggestedItems,
  getImageUrl,
  fillNewItems,
  getIdsByItems,
  devLog,
  getResourcesCraftItemsIds,
  formattedCraftingResources,
  getDefaultReturnRateByKind,
  fillProducedItemsCount
} from '../utils/utils';
import { showInterstitialAd } from '../utils/admob';
import JSONitems from '../json/items.json';
import { trackMixpanelEvent } from '../utils/mixpanel';

export const getItemPrice = createAsyncThunk(
  'itemPrice/getItemPrice',
  async (uniqueName, { getState, rejectWithValue }) => {
    const { items } = getState().search;
    const searchPrices = await items.find(item => item.uniqueName === uniqueName);
    if (searchPrices && searchPrices.prices) {
      return { uniqueName, cityPrices: searchPrices.cityPrices };
    }
    try {
      const jsonPrices = await makeRequest(
        'GET',
        'https://www.albion-online-data.com/api/v2/stats/prices/'.concat(uniqueName)
      );
      const cityPrices = formattedCityPrices(jsonPrices, uniqueName);
      return { uniqueName, cityPrices };
    } catch (error) {
      const formattedError = error.message.includes('Aborted') ? 'Request timeout' : error.message;
      const errorMessage = `${ formattedError } happened, while trying to access price info :(`;
      return rejectWithValue({ errorMessage, uniqueName });
    }
  }
);

export const getCraftItems = createAsyncThunk(
  'itemCraft/getCraftItems',
  // eslint-disable-next-line max-lines-per-function
  async (uniqueName, { rejectWithValue, getState }) => {
    const { items } = getState().search;
    const searchCraft = await items.find(item => item.uniqueName === uniqueName);
    if (searchCraft && searchCraft.craftPrices) {
      return {
        uniqueName,
        craftItems: searchCraft.craftItems,
        craftPrices: searchCraft.craftPrices,
        profits: searchCraft.profits,
        cityPrices: searchCraft.cityPrices,
        prices: searchCraft.prices,
        returnRate: searchCraft.returnRate,
        craftingRequirements: searchCraft.craftingRequirements,
        activeReceipt: searchCraft.activeReceipt
      };
    }
    try {
      const resObj = { };
      resObj.craftItems = await makeRequest('GET', 'https://gameinfo.albiononline.com/api/gameinfo/items/'.concat(uniqueName, '/data'));
      const craftReq = {
        craftResourceList: resObj.craftItems.craftingRequirements
          ? resObj.craftItems.craftingRequirements.craftResourceList : null
      };
      resObj.craftingRequirements = formattedCraftingResources(craftReq, uniqueName);
      const craftIds = getCraftItemsIds(resObj);
      const pricesIds = [...craftIds, uniqueName];
      resObj.prices = await makeRequest('GET', 'https://www.albion-online-data.com/api/v2/stats/prices/'.concat(pricesIds));
      resObj.uniqueName = uniqueName;
      resObj.craftTax = 0;
      const royalTokenExists = craftIds.find(item => item.includes('TOKEN_ROYAL'));
      resObj.returnRate = royalTokenExists ? 0 : 0.479;
      resObj.craftItems = getCraftResourcesInfo(resObj);
      resObj.craftPrices = getCurrentCraftPrices(resObj);
      return resObj;
    } catch (error) {
      const formattedError = error.message.includes('Aborted') ? 'Request timeout' : error.message;
      const errorMessage = `${ formattedError } happened, while trying to access info :(`;
      return rejectWithValue({ errorMessage, uniqueName });
    }
  }
);

export const getResourcesCraftItems = createAsyncThunk(
  'itemCraft/getResourcesCraftItems',
  // eslint-disable-next-line max-lines-per-function
  async (resItem, { rejectWithValue, getState }) => {
    const { items } = getState().search;
    const { uniqueName } = resItem;
    const searchCraft = await items.find(item => item.uniqueName === uniqueName);
    if (searchCraft && searchCraft.craftPrices) {
      return {
        uniqueName,
        craftItems: searchCraft.craftItems,
        craftPrices: searchCraft.craftPrices,
        profits: searchCraft.profits,
        cityPrices: searchCraft.cityPrices,
        prices: searchCraft.prices,
        returnRate: searchCraft.returnRate
      };
    }
    try {
      const resObj = { };
      const craftIds = getResourcesCraftItemsIds(resItem);
      const pricesIds = [...craftIds, uniqueName];
      resObj.prices = await makeRequest('GET', 'https://www.albion-online-data.com/api/v2/stats/prices/'.concat(pricesIds));
      resObj.uniqueName = uniqueName;
      resObj.craftTax = 0;
      resObj.transmutationPrice = resItem.transmutationPrice;
      resObj.returnRate = getDefaultReturnRateByKind(resItem.kind);
      resObj.craftItems = resItem.craftingRequirements.craftResourceList;
      resObj.craftPrices = getCurrentCraftPrices(resObj);
      return resObj;
    } catch (error) {
      const formattedError = error.message.includes('Aborted') ? 'Request timeout' : error.message;
      const errorMessage = `${ formattedError } happened, while trying to access craft info :(`;
      return rejectWithValue({ errorMessage, uniqueName });
    }
  }
);

export const getCraftItemsByIds = createAsyncThunk(
  'itemCraft/getCraftItemsByIds',
  // eslint-disable-next-line max-lines-per-function
  async (items, { rejectWithValue }) => {
    let ids = getIdsByItems(items);
    try {
      // eslint-disable-next-line max-lines-per-function
      let resObjArr = await Promise.all(items.map(async (item) => {
        const resObj = { };
        let craftIds;
        let craftItems;
        if (!item.craftingRequirements) {
          resObj.craftItems = await makeRequest('GET', 'https://gameinfo.albiononline.com/api/gameinfo/items/'.concat(item.uniqueName, '/data'));
          const craftReq = {
            craftResourceList: resObj.craftItems.craftingRequirements
              ? resObj.craftItems.craftingRequirements.craftResourceList : null
          };
          resObj.craftingRequirements = formattedCraftingResources(craftReq, item.uniqueName);
          craftIds = getCraftItemsIds(resObj);
          craftItems = getCraftResourcesInfo(resObj);
          const royalTokenExists = craftIds.find(it => it.includes('TOKEN_ROYAL'));
          const actualReturnRate = royalTokenExists ? 0 : 0.479;
          resObj.returnRate = item.returnRate ? item.returnRate : actualReturnRate;
        } else {
          craftIds = getResourcesCraftItemsIds(item);
          craftItems = item.craftingRequirements.craftResourceList;
          resObj.returnRate = getDefaultReturnRateByKind(item.kind);
        }
        ids = ids.concat(',', craftIds);
        resObj.uniqueName = item.uniqueName;
        resObj.craftTax = item.craftTax ? item.craftTax : 0;
        resObj.craftItems = craftItems;
        return resObj;
      }));
      const allItemPrices = await makeRequest('GET', 'https://www.albion-online-data.com/api/v2/stats/prices/'.concat(ids));
      resObjArr = resObjArr.map(item => ({
        ...item,
        prices: allItemPrices,
        craftPrices: getCurrentCraftPrices({ ...item, prices: allItemPrices })
      }));
      return resObjArr;
    } catch (error) {
      const formattedError = error.message.includes('Aborted') ? 'Request timeout' : error.message;
      const errorMessage = `${ formattedError } happened, while trying to access info :(`;
      return rejectWithValue({ errorMessage });
    }
  }
);

export const filterSearchResults = createAsyncThunk(
  'search/filterSearchResults',
  // eslint-disable-next-line max-lines-per-function
  async (searchText, thunkAPI) => {
    const { search, settings } = thunkAPI.getState();
    if (!searchText || searchText === '') return [];
    const searchItems = await JSONitems
      .filter((item) => itemSatisfySearchQuery(item, searchText, search, settings.currentLoc))
      .map(item => ({
        uniqueName: item.UniqueName,
        name: item.LocalizedNames,
        imageUrl: getImageUrl(item.UniqueName, 85),
        loading: false,
        savedInPriceList: search.savedUniqueNamesInPriceList.includes(item.UniqueName),
        savedInCraftList: search.savedUniqueNamesInCraftList.includes(item.UniqueName),
        kind: item.kind,
        craftingRequirements: item.craftingRequirements,
        activeReceipt: 0,
        craftProduce: item.craftProduce,
        craftProduce1: item.craftProduce1,
        craftProduce2: item.craftProduce2,
        craftProduce3: item.craftProduce3,
        producedItemsCount: fillProducedItemsCount(item),
        transmutationPrice: item.transmutationPrice
      }));
    const suggestedArr = await fillSuggestedItems(searchItems, settings.currentLoc);
    const suggestedItems = await [...new Set(suggestedArr)];
    return { searchItems, suggestedItems, searchText };
  }
);

export const getItemPricesByIds = createAsyncThunk('tabPrice/getItemPricesByIds', async (items, { rejectWithValue }) => {
  const resObj = { cityPrices: [], uniqueName: '' };
  if (items.length === 0 && !items) return resObj;
  try {
    const ids = getIdsByItems(items);
    if (ids === '') return resObj;
    resObj.cityPrices = await makeRequest(
      'GET',
      'https://www.albion-online-data.com/api/v2/stats/prices/'.concat(ids)
    );
    return resObj;
  } catch (error) {
    const formattedError = error.message.includes('Aborted') ? 'Request timeout' : error.message;
    const errorMessage = `${ formattedError } happened, while trying to access info :(`;
    return rejectWithValue({ errorMessage });
  }
});

export const createItemsByUniqueNames = createAsyncThunk(
  'tabPrice/createItemsByUniqueNames',
  // eslint-disable-next-line max-lines-per-function
  async (data, { getState, dispatch, rejectWithValue }) => {
    try {
      if (!data.uniqueNames || data.uniqueNames === '') return [];
      const { items, itemsType } = data.typeFor === 'PriceList' ? getState().priceList : getState().craftList;
      const itemUniqueNames = [];
      let newUniqueNames = [];
      let searchItems = [];
      items.forEach(element => itemUniqueNames.push(element.uniqueName));
      if (data.uniqueNames.length > itemUniqueNames.length) {
        newUniqueNames = data.uniqueNames.filter(e => !itemUniqueNames.includes(e));
        searchItems = await fillNewItems(newUniqueNames, itemsType);
        if (data.typeFor === 'PriceList') {
          dispatch(getItemPricesByIds(items.concat(searchItems)));
        } else {
          dispatch(getCraftItemsByIds(items.concat(searchItems)));
        }
      }
      return { items: searchItems, typeFor: data.typeFor };
    } catch (error) {
      const formattedError = error.message.includes('Aborted') ? 'Request timeout' : error.message;
      const errorMessage = `${ formattedError } happened, while trying to access info :(`;
      return rejectWithValue({ errorMessage });
    }
  }
);

export const changeStorageData = createAsyncThunk('storage/changeStorageData', async (data) => {
  const { key, value } = data;
  try {
    await AsyncStorage.setItem(key, value);
    return data;
  } catch (error) {
    return error;
  }
});

export const changePriceList = createAsyncThunk('tabPrice/changePriceList', async (uniqueName, { getState, dispatch }) => {
  const { itemUniqueNames } = getState().priceList;
  const priceExist = itemUniqueNames.find(item => item === uniqueName);
  let updatedArr;
  if (priceExist) {
    updatedArr = itemUniqueNames.filter(item => item !== uniqueName);
  } else {
    updatedArr = itemUniqueNames.concat(uniqueName);
  }
  try {
    await dispatch(changeStorageData({ key:'priceListUniqueNames', value: JSON.stringify(updatedArr) }));
    return updatedArr;
  } catch (error) {
    return error;
  }
});

export const changeCraftList = createAsyncThunk('craftSlice/changeCraftList', async (uniqueName, { getState, dispatch }) => {
  const { itemUniqueNames } = getState().craftList;
  const craftExist = itemUniqueNames.find(item => item === uniqueName);
  let updatedArr;
  if (craftExist) {
    updatedArr = itemUniqueNames.filter(item => item !== uniqueName);
  } else {
    updatedArr = itemUniqueNames.concat(uniqueName);
  }
  try {
    await dispatch(changeStorageData({ key:'craftListUniqueNames', value: JSON.stringify(updatedArr) }));
    return updatedArr;
  } catch (error) {
    return error;
  }
});

// eslint-disable-next-line max-lines-per-function
export const loadStorageData = createAsyncThunk('storage/loadStorageData', async () => {
  const currentLoc = { language: '' };
  const price = { uniqueNames: [] };
  const craft = { uniqueNames: [] };
  try {
    currentLoc.language = await AsyncStorage.getItem('currentLoc');
    price.uniqueNames = await AsyncStorage.getItem('priceListUniqueNames');
    craft.uniqueNames = await AsyncStorage.getItem('craftListUniqueNames');
    const installDate = await AsyncStorage.getItem('installDate');
    const mixpanelAliasWasCreated = await AsyncStorage.getItem('mixpanelAliasWasCreated');
    const startPopupWasShowed = await AsyncStorage.getItem('startPopupWasShowed');
    const actionsCount = await AsyncStorage.getItem('actionsCount');
    return {
      currentLoc: currentLoc.language,
      priceUniqueNames: JSON.parse(price.uniqueNames),
      craftUniqueNames: JSON.parse(craft.uniqueNames),
      installDate,
      mixpanelAliasWasCreated,
      startPopupWasShowed: JSON.parse(startPopupWasShowed),
      actionsCount
    };
  } catch (error) {
    devLog('Error Storage/loadData, error: ', error);
    return error;
  }
});

export const setInstallDate = createAsyncThunk('settings/setInstallDate', async (_, { dispatch }) => {
  const dateNow = new Date();
  dispatch(changeStorageData({ key: 'installDate', value: dateNow.toString() }));
});

export const showRateApp = createAsyncThunk('general/showRateApp', async (_, { getState, dispatch }) => {
  const { canShowAppRate } = getState().settings;
  if (!canShowAppRate) return;
  const options = {
    AppleAppID: '1589943511',
    GooglePackageName: 'com.squizard.albion',
    preferredAndroidMarket: AndroidMarket.Google,
    preferInApp: true,
    openAppStoreIfInAppFails: false
  };
  dispatch(trackMixpanelEvent('Rate App'));
  Rate.rate(options, (success, errorMessage) => {
    if (success) {
      devLog('Rate success', success);
    }
    if (errorMessage) {
      devLog('Rate failure', errorMessage);
    }
  });
});

export const updateActionsCount = createAsyncThunk('general/updateActionsCount', async (_, { dispatch, getState }) => {
  const { actionsCount, adShowsAfterActions, adLoaded } = getState().settings;
  const totalActions = actionsCount + 1;
  await dispatch(changeStorageData({ key:'actionsCount', value: totalActions.toString() }));
  if (totalActions % adShowsAfterActions === 0 && adLoaded) {
    showInterstitialAd();
  }
  return totalActions;
});

export const changeNavBarColor = async () => {
  try {
    await changeNavigationBarColor('#681A0B', true);
  } catch (e) {
    global.devLog('change NavBar Color ERROR: ', e);
  }
};
