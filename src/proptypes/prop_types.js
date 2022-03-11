import PropTypes from 'prop-types';

const CraftItemProp = PropTypes.shape({
  count: PropTypes.number,
  uniqueName: PropTypes.string
});

export const PricePropType = PropTypes.shape({
  buy: PropTypes.number,
  buyDate: PropTypes.string,
  city: PropTypes.string,
  item_id: PropTypes.string,
  sell: PropTypes.number,
  sellDate: PropTypes.string
});

export const CraftPricePropType = PropTypes.shape({
  buy: PropTypes.number,
  buyDate: PropTypes.string,
  city: PropTypes.string,
  itemIds: PropTypes.arrayOf(PropTypes.string),
  sell: PropTypes.number,
  sellDate: PropTypes.string
});

export const ProfitPropType = PropTypes.shape({
  city: PropTypes.string,
  sell: PropTypes.number,
  buy: PropTypes.number
});

const NamePropType = PropTypes.shape({
  'DE-DE': PropTypes.string,
  'EN-US': PropTypes.string,
  'ES-ES': PropTypes.string,
  'FR-FR': PropTypes.string,
  'KO-KR': PropTypes.string,
  'PL-PL': PropTypes.string,
  'PT-BR': PropTypes.string,
  'RU-RU': PropTypes.string,
  'ZH-CN': PropTypes.string
});

export const ListItemPropType = PropTypes.shape({
  id: PropTypes.string,
  name: NamePropType,
  imageUrl: PropTypes.string,
  loadingCraft: PropTypes.bool,
  loadingPrice: PropTypes.bool,
  price: PropTypes.arrayOf(PricePropType),
  craftItems: PropTypes.arrayOf(CraftItemProp),
  craftItemPrice: PropTypes.arrayOf(PropTypes.array)
});

const CraftItemPropType = PropTypes.shape({
  count: PropTypes.number,
  uniqueName: PropTypes.string
});

export const CraftItemsPropType = PropTypes.arrayOf(CraftItemPropType);

export const CityCraftPropType = PropTypes.shape({
  type: PropTypes.string,
  uniqueName: PropTypes.string,
  typeFrom: PropTypes.string,
  savedInPriceList: PropTypes.bool,
  savedInCraftList: PropTypes.bool,
  returnRateProfit: PropTypes.arrayOf(ProfitPropType),
  returnRateCraftPrices: PropTypes.arrayOf(CraftPricePropType),
  returnRate: PropTypes.number,
  prices: PropTypes.arrayOf(PricePropType),
  loading: PropTypes.bool,
  kind: PropTypes.string,
  imageUrl: PropTypes.string,
  errorMessage: PropTypes.string,
  craftTax: PropTypes.number,
  craftPrices: PropTypes.arrayOf(CraftPricePropType),
  craftLoading: PropTypes.bool,
  craftItems: CraftItemsPropType,
  craftCheckDate: PropTypes.string,
  cityPrices: PropTypes.arrayOf(PricePropType),
  activeReceipt: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  craftingRequirements: PropTypes.object
});
