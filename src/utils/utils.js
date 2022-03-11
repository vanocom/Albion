/* eslint-disable max-lines */
import I18n, { getLanguages } from 'react-native-i18n';
import Config from 'react-native-config';
import items from '../json/items.json';
import ItemValuesJSON from '../json/resources_values.json';
import CONST from '../const/const';

const zeroReturnResources = [
  'ARTEFACT', 'CAPEITEM', 'SKILLBOOK', 'FACTION', 'QUESTITEM', '_CAPE', 'T8_MOUNTUPGRADE_HORSE_CURSE', 'T8_MOUNTUPGRADE_COUGAR_KEEPER',
  'T8_MOUNTUPGRADE_HORSE_MORGANA', '_SET', 'T3_FARM_HORSE_GROWN', 'T4_FARM_HORSE_GROWN', 'T5_FARM_HORSE_GROWN', 'T6_FARM_HORSE_GROWN',
  'T7_FARM_HORSE_GROWN', 'T8_FARM_HORSE_GROWN', 'T3_FARM_OX_GROWN', 'T4_FARM_OX_GROWN', 'T5_FARM_OX_GROWN', 'T6_FARM_OX_GROWN',
  'T7_FARM_OX_GROWN', 'T8_FARM_OX_GROWN', 'T4_FARM_GIANTSTAG_GROWN', 'T6_FARM_GIANTSTAG_MOOSE_GROWN', 'T6_FARM_DIREWOLF_GROWN',
  'T3_FARM_CHICKEN_GROWN', 'T4_FARM_GOAT_GROWN', 'T5_FARM_GOOSE_GROWN', 'T6_FARM_SHEEP_GROWN', 'T7_FARM_PIG_GROWN', 'T8_FARM_COW_GROWN',
  'T7_FARM_DIREBOAR_GROWN', 'T7_FARM_SWAMPDRAGON_GROWN', 'T8_FARM_DIREBEAR_GROWN', 'T8_FARM_MAMMOTH_GROWN', 'T5_FARM_MOABIRD_FW_BRIDGEWATCH_GROWN',
  'T5_FARM_DIREBEAR_FW_FORTSTERLING_GROWN', 'T5_FARM_DIREBOAR_FW_LYMHURST_GROWN', 'T5_FARM_RAM_FW_MARTLOCK_GROWN', 'T5_FARM_SWAMPDRAGON_FW_THETFORD_GROWN',
  'T5_FARM_GREYWOLF_FW_CAERLEON_GROWN', 'T8_FARM_MOABIRD_FW_BRIDGEWATCH_GROWN', 'T8_FARM_DIREBEAR_FW_FORTSTERLING_GROWN', 'T8_FARM_DIREBOAR_FW_LYMHURST_GROWN',
  'T8_FARM_RAM_FW_MARTLOCK_GROWN', 'T8_FARM_SWAMPDRAGON_FW_THETFORD_GROWN', 'T8_FARM_GREYWOLF_FW_CAERLEON_GROWN', 'T8_MOUNT_MAMMOTH_TRANSPORT',
  'T7_MOUNT_SWAMPDRAGON', 'T6_MOUNT_OX', 'T8_MOUNT_HORSE', 'T8_MOUNT_ARMORED_HORSE', 'T5_FARM_COUGAR_GROWN', 'T5_MOUNT_COUGAR_KEEPER', 'UNIQUE_GVGTOKEN_GENERIC'
];
const billion = 1000000000;
const million = 1000000;

export const groupByKey = (xs, key) => xs.reduce((rv, x) => {
  // eslint-disable-next-line no-param-reassign
  (rv[x[key]] = rv[x[key]] || []).push(x);
  return rv;
}, {});

export const groupByColumns = (arr, n) => {
  const group = [];
  for (let i = 0, end = arr.length / n; i < end; i += 1) {
    group.push(arr.slice(i * n, (i + 1) * n));
  }
  return group;
};

export const setUpTranslation = (dispatch, setLocalization) => {
  I18n.fallbacks = true;
  getLanguages().then(languages => {
    const primaryLanguage = languages.map(lang => lang.split('-')[0].toUpperCase());
    let localeToUse = 'EN-US';
    CONST.availableTranslations.forEach(locale => {
      primaryLanguage.find(prim => {
        if (locale.includes(prim)) {
          localeToUse = locale;
          return true;
        }
        return false;
      });
    });
    dispatch(setLocalization(localeToUse));
  });
};

export const fillProducedItemsCount = (item) => {
  const {
    craftProduce, craftProduce1,
    craftProduce2, craftProduce3, craftItems
  } = item;
  let producedItemsCount = craftProduce || 1;
  if (!craftItems) return producedItemsCount;
  if (craftProduce1 || craftProduce2 || craftProduce3) {
    if (craftItems.find(el => el.uniqueName.includes('@1')) && craftProduce1) {
      producedItemsCount = craftProduce1;
    }
    if (craftItems.find(el => el.uniqueName.includes('@2')) && craftProduce2) {
      producedItemsCount = craftProduce2;
    }
    if (craftItems.find(el => el.uniqueName.includes('@3')) && craftProduce3) {
      producedItemsCount = craftProduce3;
    }
  }
  return producedItemsCount;
};

// eslint-disable-next-line max-lines-per-function
export const getInfoByUniqueName = (uniqueName, language) => {
  let res = {};
  items.map(item => {
    if (item.UniqueName === uniqueName) {
      res = {
        uniqueName: item.UniqueName,
        kind: item.kind,
        craftProduce: item.craftProduce,
        craftProduce1: item.craftProduce1,
        craftProduce2: item.craftProduce2,
        craftProduce3: item.craftProduce3,
        producedItemsCount: fillProducedItemsCount(item),
        transmutationPrice: item.transmutationPrice,
        craftingRequirements: item.craftingRequirements,
        craftTax: 0,
        name: (item.LocalizedNames && language in item.LocalizedNames) ? item.LocalizedNames[language] : '',
        description: (item.LocalizedDescriptions && language in item.LocalizedDescriptions) ? item.LocalizedDescriptions[language] : ''
      };
    }
    return item;
  });

  return res;
};

const suffixiedPrice = (num) => {
  if (!num || Number.isNaN(num)) {
    return ({ value: num, suffix: '' });
  }
  if (num >= billion || num <= -billion) {
    return ({ value: (num / billion).toFixed(2), suffix:' B' });
  }
  if (num >= million || num <= -million) {
    return ({ value: (num / million).toFixed(2), suffix:' M' });
  }
  return ({ value: num, suffix: '' });
};

export const formatNumber = (num) => {
  const dividedNum = suffixiedPrice(num);

  const reversed =  dividedNum.value.toString().split('').reverse().join('');
  const formated = reversed.replace(/\d{3}(?=.)/g, '$& ');
  return (formated.split('').reverse().join('').concat(dividedNum.suffix))
    .replace('- ', '-');
};

export const getResourcesCraftItemsIds = (craftInfo) => {
  if (!craftInfo.craftingRequirements) {
    return [];
  }
  const allLists = Object.values(craftInfo.craftingRequirements)
    .filter(item => Array.isArray(item));
  const allUniqueNames = allLists.map(arr => arr.map(item => item.uniqueName));
  const allUniqueNamesArr = allUniqueNames.reduce((prev, cur) => prev.concat(cur));
  const unique = [...new Set(allUniqueNamesArr)];
  return unique;
};

export const getCraftItemsIds = (craftInfo) => {
  if (!craftInfo.craftingRequirements) {
    return [];
  }
  const list = Object.values(craftInfo.craftingRequirements);
  if (list.length === 1) {
    return craftInfo.craftingRequirements.craftResourceList.map(item => item.uniqueName);
  }
  const allLists = list.filter(item => Array.isArray(item));
  const allUniqueNames = allLists.map(arr => arr.map(item => item.uniqueName));
  const allUniqueNamesArr = allUniqueNames.reduce((prev, cur) => prev.concat(cur));
  const unique = [...new Set(allUniqueNamesArr)];
  return unique;
};

export const getCraftResourcesInfo = (craftInfo) => {
  if (!craftInfo.craftingRequirements) {
    return [];
  }
  return craftInfo.craftingRequirements.craftResourceList;
};

// eslint-disable-next-line max-lines-per-function
const calculateCraftTaxes = (craftItems, craftTax, uniqueName, transmutationPrice) => {
  if (uniqueName.includes('T1_') || uniqueName.includes('T2_')) {
    return 0;
  }
  if (uniqueName.includes('STONEBLOCK') ||  transmutationPrice) {
    if (craftTax > 0) {
      const stoneValue = ItemValuesJSON[uniqueName] * 0.1125 * (craftTax / 100);
      return stoneValue;
    }
    return 0;
  }
  if (uniqueName.includes('MEAT')) {
    if (craftTax > 0) {
      const jsonItem = items.find((it) => it.UniqueName.includes(uniqueName));
      const meatValue = ItemValuesJSON[uniqueName]
        * jsonItem.craftProduce * 0.1125 * (craftTax / 100);
      return meatValue;
    }
  }
  const itemValue = craftItems
    .map(item => ItemValuesJSON[item.uniqueName] * item.count)
    .reduce((prev, next) => prev + next);
  if (craftTax > 0) {
    return itemValue * 0.1125 * (craftTax / 100);
  }
  return 0;
};

export const itemValuesEmpty = (craftItems) => craftItems.some(
  item => ItemValuesJSON[item.uniqueName] === null || ItemValuesJSON[item.uniqueName] === undefined
);

const returnRateIsNotCalculated = (resource) => {
  const resId = resource.uniqueName;
  const included = zeroReturnResources.find(item => resId.includes(item));
  return included;
};

// eslint-disable-next-line max-lines-per-function
const fullCraftPrices = (data) => {
  const {
    prices, craftItems, returnRate, kind
  } = data;
  const craftItemsIds = craftItems.map(item => item.uniqueName);
  const resourcesPrices = prices.filter(priceItem => craftItemsIds.includes(priceItem.item_id)
    && priceItem.quality === 1);
  // eslint-disable-next-line max-lines-per-function
  return resourcesPrices.map(priceItem => {
    const resource = craftItems.find(craftItem => craftItem.uniqueName === priceItem.item_id);
    const { count } = resource;
    const { sell_price_min, buy_price_max } = priceItem;
    let actualReturnRate = returnRate;
    if (returnRateIsNotCalculated(resource)) {
      actualReturnRate = 0;
    }
    if (kind === 'resource' && resource.uniqueName.includes('FACTION')) {
      actualReturnRate = returnRate;
    }
    const returnRateSellPrice = Math.round(sell_price_min - (sell_price_min * actualReturnRate));
    const returnRateBuyPrice = Math.round(buy_price_max - (buy_price_max * actualReturnRate));
    return {
      ...priceItem,
      sell_price_min: returnRateSellPrice === 0 ? NaN : returnRateSellPrice * count,
      buy_price_max: returnRateBuyPrice === 0 ? NaN : returnRateBuyPrice * count
    };
  });
};

const fullCraftItemPrice = (resourcePrice, initialPrice) => {
  const itemIds = [resourcePrice[1][0].item_id];
  let sellSumm = resourcePrice[1][0].sell_price_min;
  let buySumm = resourcePrice[1][0].buy_price_max;
  return resourcePrice[1].reduce((prev, curr) => {
    itemIds.push(curr.item_id);
    sellSumm += curr.sell_price_min;
    buySumm += curr.buy_price_max;
    return ({
      ...initialPrice,
      itemIds,
      sell: sellSumm,
      buy: buySumm
    });
  });
};

const actualCraftPrices = (cityPricesArr, craftItems) => cityPricesArr
  .filter(cityPrice => cityPrice[1].length === craftItems.length)
  .map(resourcePrice => {
    const initialPrice = {
      sell: resourcePrice[1][0].sell_price_min,
      itemIds: [resourcePrice[1][0].item_id],
      buy: resourcePrice[1][0].buy_price_max,
      city: resourcePrice[1][0].city,
      buyDate: resourcePrice[1][0].buy_price_max_date,
      sellDate: resourcePrice[1][0].sell_price_min_date
    };
    if (resourcePrice[1].length === 1) {
      return initialPrice;
    }
    return fullCraftItemPrice(resourcePrice, initialPrice);
  });

// eslint-disable-next-line max-lines-per-function
export const getCurrentCraftPrices = (data) => {
  const {
    craftItems, craftTax, uniqueName, transmutationPrice, userProducedItemsCount
  } = data;
  if (!craftItems || craftItems.length === 0) return [];
  const tax = calculateCraftTaxes(craftItems, craftTax, uniqueName, transmutationPrice);
  const pricesWithCount = fullCraftPrices(data);
  const groupByItemCityPrices = groupByKey(pricesWithCount, 'city');
  const cityPricesArr = Object.entries(groupByItemCityPrices);
  const actualPrices = actualCraftPrices(cityPricesArr, craftItems);
  const filteredPrices = actualPrices
    .filter(price => price.sell || price.buy)
    .map(price => ({
      ...price,
      sell: Math.round(
        (price.sell + tax + (transmutationPrice || 0)) * (userProducedItemsCount || 1)
      ),
      buy: Math.round((price.buy + tax + (transmutationPrice || 0)) * (userProducedItemsCount || 1))
    }));
  return filteredPrices;
};

const minSellPriceBetter = (prev, curr) => {
  let minSellBetter;
  if (prev.sell_price_min === 0) {
    minSellBetter = true;
  } else {
    minSellBetter = (curr.sell_price_min < prev.sell_price_min && curr.sell_price_min > 0);
  }
  return minSellBetter;
};

const calculateMinMaxCityPrices = (cityPrices) => cityPrices.map(cityItem => {
  const allCityPrices = cityItem[1];
  const initialEntry = cityItem[1][0];
  return allCityPrices.reduce((prev, curr) => {
    const minSellBetter = minSellPriceBetter(prev, curr);
    const maxBuyBetter = curr.buy_price_max > prev.buy_price_max;
    const minSell = minSellBetter ? curr.sell_price_min : prev.sell_price_min;
    const maxBuy = maxBuyBetter ? curr.buy_price_max : prev.buy_price_max;
    const minSellDate = minSellBetter ? curr.sell_price_min_date : initialEntry.sell_price_min_date;
    const maxBuyDate = maxBuyBetter ? curr.buy_price_max_date : initialEntry.buy_price_max_date;
    return {
      ...initialEntry,
      sell_price_min: minSell === 0 ? NaN : minSell,
      buy_price_max: maxBuy === 0 ? NaN : maxBuy,
      sell_price_min_date: minSellDate,
      buy_price_max_date: maxBuyDate
    };
  });
});

export const formattedCityPrices = (prices, uniqueName) => {
  if (!prices) return null;
  const itemPrices = prices.filter(priceItem => priceItem.item_id === uniqueName);
  const groupedItemPrices = groupByKey(itemPrices, 'city');
  const cityPrices = Object.entries(groupedItemPrices);
  const minMaxItemPrices = calculateMinMaxCityPrices(cityPrices);
  const formattedPrices = minMaxItemPrices.map(price => ({
    city: price.city,
    sell: price.sell_price_min,
    buy: price.buy_price_max,
    buyDate: price.buy_price_max_date,
    sellDate: price.sell_price_min_date
  })).filter(item => item.sell || item.buy);
  return formattedPrices;
};

// eslint-disable-next-line max-lines-per-function
export const calculateCraftProfit = (data) => {
  const {
    craftItems, prices, uniqueName, producedItemsCount, totalProducedItemsCount
  } = data;
  if (!craftItems || craftItems.length === 0) {
    return [];
  }
  const minMaxItemPrices = formattedCityPrices(prices, uniqueName);
  const craftPrices = getCurrentCraftPrices(data);
  const craftPricesCities = craftPrices.map(price => price.city);
  const citiesItems = minMaxItemPrices.filter(price => craftPricesCities.includes(price.city));
  const profits = citiesItems.map(cityItem => {
    const craftPrice = craftPrices.find(item => item.city === cityItem.city);
    const sellValue = (cityItem.sell * (totalProducedItemsCount || producedItemsCount))
    - craftPrice.sell;
    const buyValue = (cityItem.sell * (totalProducedItemsCount || producedItemsCount))
    - craftPrice.buy;
    return {
      city: cityItem.city,
      sell: sellValue,
      sellPercent: sellValue * 100 / craftPrice.sell,
      buy: buyValue,
      buyPercent: buyValue * 100 / craftPrice.buy
    };
  });
  const filteredProfits = profits.filter(profit => profit.sell || profit.buy);
  return filteredProfits;
};

export const timeDifferenceDays = (diffInMilliSeconds) => {
  const days = Math.floor(diffInMilliSeconds / 86400);
  return days;
};

export const timeDifferenceHours = (diffInMilliSeconds) => {
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  return hours;
};

export const timeDifferenceMinutes = (diffInMilliSeconds) => {
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  return minutes;
};

export const timeDifference = (date) => {
  const dateNow = new Date();
  const datePast = new Date(date);
  const diffInMilliSeconds = Math.abs(datePast - dateNow) / 1000;
  const days = timeDifferenceDays(diffInMilliSeconds);
  const hours = timeDifferenceHours(diffInMilliSeconds);
  const minutes = timeDifferenceMinutes(diffInMilliSeconds);
  if (days > 1) {
    return { value:I18n.t('yesterday'), style: 0 };
  }
  if (hours > 1) {
    return { value:`${ hours } ${ I18n.t('hours') }`, style: 1 };
  }
  return { value:`${ minutes } ${ I18n.t('minutes') }`, style: 2 };
};

export const timeDifferenceDay = (dateStr) => {
  if (!dateStr) return 0;
  const dateNow = new Date();
  const datePast = new Date(dateStr);
  const diffInMilliSeconds = Math.abs(datePast - dateNow) / 1000;
  const days = timeDifferenceDays(diffInMilliSeconds);
  return days;
};

export const timeDifferenceMinute = (dateStr) => {
  const dateNow = new Date();
  const datePast = new Date(dateStr);
  const diffInMilliSeconds = Math.abs(datePast - dateNow) / 1000;
  return timeDifferenceMinutes(diffInMilliSeconds);
};

export const getImageUrl = (id, size) => {
  const modifiedId = id.includes('Level') ? id.slice(0, -2) : id;
  const imageUrl = `${ CONST.imageUrl }${ modifiedId }.png?size=${ size }`;
  return imageUrl;
};

export const getImageUrlWithLevel = (id, size) => {
  const modifiedId = id.replace('@', '_LEVEL');
  return `${ CONST.imageUrl }${ modifiedId }.png?size=${ size }`;
};

export const converSecontToMinutes = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - (minutes * 60);
  return `${ minutes }:${ seconds < 10 ? '0'.concat(seconds) : seconds }`;
};
export const getIdFromModalType = (modalId) => modalId.substring(modalId.indexOf(':') + 1);

export const fillSuggestedItems = async (searchItems, language) => {
  const suggestedItems = [];
  await searchItems.forEach(item => {
    if (suggestedItems.indexOf(item.name) === -1) suggestedItems.push(item.name[language]);
  });
  return suggestedItems;
};

export const itemSatisfySearchQuery = (item, searchText, state, language) => {
  if (!item.LocalizedNames) {
    return false;
  }
  if (!item.LocalizedNames[language]) {
    return false;
  }
  const lowerCaseJsonName = item.LocalizedNames[language].toLowerCase();
  const lowerCaseSearchText = searchText.toLowerCase();
  const lowerCaseId = item.UniqueName.toLowerCase();
  const { tier, ench } = state;
  const includeTier = tier.value;
  const includeEnch = ench.value;
  if (includeTier && !lowerCaseId.includes(includeTier)) return false;
  if (includeEnch && !lowerCaseId.includes(includeEnch)) return false;
  return lowerCaseJsonName.includes(lowerCaseSearchText);
};

export const fillNewItems = (newUniqueNames, itemsType) => items
  .filter((jsonItem) => newUniqueNames.includes(jsonItem.UniqueName))
  .map(item => ({
    uniqueName: item.UniqueName,
    name: item.LocalizedNames,
    imageUrl: getImageUrl(item.UniqueName, 85),
    loading: false,
    type: itemsType,
    kind: item.kind,
    activeReceipt: 0,
    craftingRequirements: item.craftingRequirements,
    craftProduce: item.craftProduce,
    craftProduce1: item.craftProduce1,
    craftProduce2: item.craftProduce2,
    craftProduce3: item.craftProduce3,
    producedItemsCount: fillProducedItemsCount(item),
    transmutationPrice: item.transmutationPrice
  }));

export const getIdsByItems = (arrItems) => {
  let ids = '';
  arrItems.map(obj => {
    ids += (obj.uniqueName).concat(',');
  });
  ids = ids.slice(0, -1);
  return ids;
};

// eslint-disable-next-line max-lines-per-function
export const fillExistingItem = (item, payload, itemExist) => {
  if (item.uniqueName === itemExist.uniqueName) {
    let activeReceipt = 0;
    if (item.craftingRequirements) {
      const craftList = Object.values(item.craftingRequirements);
      activeReceipt = craftList.findIndex(
        el => JSON.stringify(el) === JSON.stringify(payload.craftItems)
      );
    }
    const producedItemsCount = fillProducedItemsCount({ ...itemExist, ...payload });
    const updatedItem = ({
      ...itemExist,
      ...payload,
      craftLoading: false,
      loading: false,
      producedItemsCount,
      cityPrices: formattedCityPrices(payload.prices, payload.uniqueName),
      returnRateCraftPrices: getCurrentCraftPrices({
        ...itemExist, ...payload, producedItemsCount
      }),
      returnRateProfit: calculateCraftProfit({ ...itemExist, ...payload, producedItemsCount }),
      craftCheckDate: (new Date()).toString(),
      craftingRequirements: item.craftingRequirements || payload.craftingRequirements,
      transmutationPrice: item.transmutationPrice,
      activeReceipt: payload.activeReceipt || activeReceipt
    });
    return updatedItem;
  }
  return item;
};

export const devLog = (message, ...optionalParams) => {
  if (Config.ENV === 'dev') {
    console.log(message, ...optionalParams);
  }
};

export const getDefaultReturnRateByKind = (kind) => {
  switch (kind) {
    case 'basic_res':
      return 0;
    case 'resource':
      return 0.539;
    default:
      return 0.479;
  }
};

// eslint-disable-next-line max-lines-per-function
export const formattedCraftingResources = (craftReq, uniqueName) => {
  if (!craftReq || !craftReq.craftResourceList) {
    return null;
  }
  const enchantmentExists = uniqueName.includes('@');
  let enchantment = '';
  let royalEnch = '';
  if (enchantmentExists) {
    const enchLevel = uniqueName.charAt(uniqueName.length - 1);
    enchantment = `_LEVEL${ enchLevel }@${ enchLevel }`;
    royalEnch = `@${ enchLevel }`;
  }
  const craftItems = craftReq.craftResourceList;
  const royalTokenFound = craftItems.find(item => item.uniqueName.includes('TOKEN_ROYAL'));
  if (!royalTokenFound) {
    // eslint-disable-next-line max-lines-per-function
    const correctedItems = craftReq.craftResourceList.map(item => {
      if (item.uniqueName.includes('ARTEFACT')) {
        return { ...item, uniqueName: item.uniqueName };
      }
      if (item.uniqueName.includes('CAPEITEM')) {
        return { ...item, uniqueName: item.uniqueName };
      }
      if (item.uniqueName.includes('SKILLBOOK')) {
        return { ...item, uniqueName: item.uniqueName };
      }
      if (item.uniqueName.includes('FACTION')) {
        return { ...item, uniqueName: item.uniqueName };
      }
      if (item.uniqueName.includes('TOKEN_ROYAL')) {
        return { ...item, uniqueName: item.uniqueName };
      }
      if (enchantmentExists) {
        return { ...item, uniqueName: item.uniqueName.concat(`${ enchantment }`) };
      }
      return item;
    });
    return ({ craftResourceList: correctedItems });
  }
  const mainCraftItem = craftItems.find(item => item.uniqueName.includes('SET'));
  if (!mainCraftItem) {
    return craftReq;
  }
  const setUniqueName = mainCraftItem.uniqueName;
  const setOriginStr = setUniqueName.slice(0, setUniqueName.length - 1);
  const royalReq = ({
    craftResourceList: [{ ...mainCraftItem, uniqueName: `${ setOriginStr }1${ royalEnch }` }, royalTokenFound],
    craftResourceList1: [{ ...mainCraftItem, uniqueName: `${ setOriginStr }2${ royalEnch }` }, royalTokenFound],
    craftResourceList2: [{ ...mainCraftItem, uniqueName: `${ setOriginStr }3${ royalEnch }` }, royalTokenFound]
  });
  return royalReq;
};
