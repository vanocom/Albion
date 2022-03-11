import React from 'react';
import { useDispatch } from 'react-redux';
import I18n from 'react-native-i18n';
import { View, Text, TouchableOpacity } from 'react-native';
import { showModalWithID } from '../../slices/modal';
import {
  CityPricesView, CraftProfitView, FMButton, CraftItems
} from '../common';
import { changeActiveReceipt } from '../../slices/search';
import {
  changeActiveReceipt as changeCraftActiveReceipt
} from '../../slices/craft_list';
import {
  changeActiveReceipt as changeDetailsActiveReceipt
} from '../../slices/details';
import { itemValuesEmpty } from '../../utils/utils';
import { CityCraftPropType } from '../../proptypes/prop_types';
import styles from '../common/styles';
import localStyles from './styles';
import CONST from '../../const/const';

const getButtonTitle = (returnRate, kind) => {
  const returnRateSource = kind === 'resource' ? CONST.resourceReturnRate : CONST.returnRate;
  const findItem = returnRateSource.find(
    rate => rate.regular.value === returnRate || rate.focus.value === returnRate
  );
  let titleValues = { };
  if (findItem.regular.value === returnRate) {
    titleValues = { displayValue: findItem.regular.displayValue, focus: ':' };
  } else {
    titleValues = { displayValue: findItem.focus.displayValue, focus: ' (Focus):' };
  }

  return `${ I18n.t('returnRate') }: ${ titleValues.displayValue }%`;
};

// eslint-disable-next-line max-lines-per-function
const renderReturnRate = (data) => {
  const {
    returnRate, uniqueName, dispatch, typeFrom, kind, craftItems
  } = data;
  const includesRoyalToken = craftItems.find(item => item.uniqueName.includes('TOKEN_ROYAL'));
  if (kind === 'basic_res' || includesRoyalToken) {
    return null;
  }
  return (
    <View key="city_craft_return_rate">
      <View style={ styles.fmButtonReturnRateContainer }>
        <FMButton
          title={ getButtonTitle(returnRate, kind) }
          action={ () => {
            dispatch(showModalWithID({
              modalId: CONST.modal.returnRate,
              data: {
                returnRate, uniqueName, typeFrom, kind
              }
            }));
          } }
          countAction={ false }
          labelStyle={ styles.popupReturnRateLabel }
        />
      </View>
    </View>
  );
};

// eslint-disable-next-line max-lines-per-function
const renderProducedItemsPicker = (data) => {
  const {
    uniqueName, producedItemsCount, dispatch, recipes,
    userProducedItemsCount, totalProducedItemsCount, typeFrom
  } = data;
  const recExists = recipes && recipes.length > 1;
  return (
    <View key="city_craft_produced_items">
      <View style={ [styles.fmButtonReturnProducedItems, recExists ? { marginTop: 15 } : null] }>
        <FMButton
          title={ `${ I18n.t('producedItems') }: ${ totalProducedItemsCount || producedItemsCount }` }
          action={ () => {
            dispatch(showModalWithID({
              modalId: CONST.modal.producedItems,
              data: {
                producedItemsCount,
                uniqueName,
                userProducedItemsCount,
                typeFrom
              }
            }));
          } }
          countAction={ false }
          labelStyle={ styles.popupReturnRateLabel }
        />
      </View>
    </View>
  );
};

const receiptsList = (uniqueName, index) => ({
  details: changeDetailsActiveReceipt({ uniqueName, activeReceipt: index }),
  search: changeActiveReceipt({ uniqueName, activeReceipt: index }),
  craftList: changeCraftActiveReceipt({ uniqueName, activeReceipt: index })
});

// eslint-disable-next-line max-lines-per-function
const renderTaxPicker = (data) => {
  const {
    uniqueName, dispatch, craftTax, typeFrom, craftItems
  } = data;
  if (itemValuesEmpty(craftItems)) {
    return null;
  }
  return (
    <View key="city_craft_tax_picker">
      <View style={ [styles.fmButtonReturnProducedItems, { marginTop: 10 }] }>
        <FMButton
          title={ `${ I18n.t('usageFee') }: ${ craftTax }` }
          action={ () => {
            dispatch(showModalWithID({
              modalId: CONST.modal.nutrition,
              data: {
                craftTax,
                uniqueName,
                typeFrom
              }
            }));
          } }
          countAction={ false }
          labelStyle={ styles.popupReturnRateLabel }
        />
      </View>
    </View>
  );
};

const craftPriceLabel = (kind) => {
  switch (kind) {
    case 'resource':
      return I18n.t('refiningPrice');
    case 'basic_res':
      return I18n.t('transmutationPrice');
    default:
      return I18n.t('craftPrice');
  }
};

const renderCityPrices = (returnRateCraftPrices, kind) => (
  <CityPricesView
    data={ returnRateCraftPrices }
    title={ craftPriceLabel(kind) }
    key="city_craft_prices"
    showLabelTitle={ false }
  />
);

const renderCraftProfit = (returnRateProfit) => (
  <CraftProfitView
    profits={ returnRateProfit }
    key="city_craft_profit"
  />
);

const renderReceipt = (index, active, dispatch, uniqueName, typeFrom, recipesLength) => {
  const recActive = active === index;
  const buttonStyle = recActive
    ? localStyles.activeReceiptButton : localStyles.disabledReceiptButton;
  const labelStyle = recActive ? localStyles.activeReceiptLabel : localStyles.disabledReceiptLabel;
  const label = recipesLength > 2 ? I18n.t('rec') : I18n.t('receipt');
  return (
    <TouchableOpacity
      style={ buttonStyle }
      key={ index.toString() }
      onPress={ () => dispatch(receiptsList(uniqueName, index)[typeFrom]) }
    >
      <Text style={ labelStyle }>
        { `${ label } ${ index + 1 }` }
      </Text>
    </TouchableOpacity>
  );
};

const renderRecipesTabs = (recipes, activeReceipt, dispatch, uniqueName, typeFrom) => {
  if (!recipes || recipes.length === 1) {
    return null;
  }
  return (
    <View style={ localStyles.receiptTabs }>
      { recipes.map(
        (rec, index) => renderReceipt(
          index, activeReceipt, dispatch, uniqueName, typeFrom, recipes.length
        )
      )
      }
    </View>
  );
};

// eslint-disable-next-line max-lines-per-function
export const CityCraft = ({ payload, navigation }) => {
  const {
    uniqueName, returnRateCraftPrices, craftingRequirements,
    returnRateProfit, typeFrom, kind, activeReceipt, craftItems,
    userProducedItemsCount
  } = payload;
  let recipes;
  if (craftingRequirements) { recipes = Object.values(craftingRequirements); }
  const dispatch = useDispatch();
  return (
    <View style={ localStyles.cityCraftContainer }>
      { renderRecipesTabs(recipes, activeReceipt, dispatch,  uniqueName, typeFrom) }
      { renderProducedItemsPicker({ ...payload, dispatch, recipes }) }
      <CraftItems
        craftItems={ craftItems }
        navigation={ navigation }
        userProducedItemsCount={ userProducedItemsCount }
      />
      { renderCraftProfit(returnRateProfit) }
      { renderTaxPicker({ ...payload, dispatch }) }
      { renderReturnRate({ ...payload, dispatch }) }
      { renderCityPrices(returnRateCraftPrices, kind) }
    </View>
  );
};

CityCraft.propTypes = {
  payload: CityCraftPropType.isRequired
};
