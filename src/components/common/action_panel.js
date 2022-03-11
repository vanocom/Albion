import React from 'react';
import {
  View
} from 'react-native';
import PropType from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import I18n from 'react-native-i18n';
import { FMButton } from './fm_button';
import {
  getItemPrice, getCraftItems, changePriceList,
  changeCraftList, getResourcesCraftItems
} from '../../slices/async_thuks';
import { selectSearch, changeItemType, scrollToItem } from '../../slices/search';
import styles from './styles';
import { showModalWithID } from '../../slices/modal';
import { trackMixpanelEvent } from '../../utils/mixpanel';
import CONST from '../../const/const';
import { timeDifferenceMinute } from '../../utils/utils';
import { CraftListCTA, PriceListCTA, RequestTimerButton } from '.';
import { selectPrice } from '../../slices/price_list';
import { selectCraft } from '../../slices/craft_list';

const renderSeparator = <View style={ { width: 10 } } />;

const craftLabel = (kind) => {
  switch (kind) {
    case 'resource':
      return I18n.t('refining');
    case 'basic_res':
      return I18n.t('transmutation');
    default:
      return I18n.t('craftCheck');
  }
};

// eslint-disable-next-line max-lines-per-function
const renderActionPanelForSearch = (dispatch, item, uniqueName) => {
  const resourceItem = item.kind === 'resource' || item.kind === 'basic_res' || item.kind === 'mount' || item.kind === 'supplies';
  return (
    <View>
      <View style={ styles.fmTopButtonsContainer }>
        <FMButton
          style={ styles.fmButton }
          title={ I18n.t('priceCheck') }
          duration={ 5 }
          action={ () => {
            dispatch(trackMixpanelEvent('Price Check', { 'Unique Name' : uniqueName, Screen: 'Search' }));
            const { priceCheckDate } = item;
            const minutePass = timeDifferenceMinute(priceCheckDate) >= 1;
            if (item.cityPrices && item.cityPrices.length > 0 && !minutePass) {
              dispatch(changeItemType({ itemType: 'PRICE', uniqueName }));
              return;
            }
            dispatch(scrollToItem());
            dispatch(getItemPrice(uniqueName));
          } }
          loading={ item.priceLoading }
        />
        { renderSeparator }
        { PriceListCTA(dispatch, item, 'Search') }
      </View>
      <View style={ { flexDirection: 'row' } }>
        <FMButton
          action={ () => {
            dispatch(trackMixpanelEvent('Craft Check', { 'Unique Name' : uniqueName, Screen: 'Search' }));
            const { craftCheckDate } = item;
            const minutePass = timeDifferenceMinute(craftCheckDate) >= 1;
            if (item.craftPrices && item.craftPrices.length > 0 && !minutePass) {
              dispatch(changeItemType({ itemType: 'CRAFT', uniqueName }));
              return;
            }
            if (resourceItem) {
              dispatch(getResourcesCraftItems(item));
              return;
            }
            dispatch(scrollToItem());
            dispatch(getCraftItems(uniqueName));
          } }
          title={ craftLabel(item.kind) }
          loading={ item.craftLoading }
          duration={ 5 }
        />
        { renderSeparator }
        { CraftListCTA(dispatch, item, 'Search') }
      </View>
    </View>
  );
};

// eslint-disable-next-line max-lines-per-function
const renderActionPanelForPriceOrCraft = (dispatch, uniqueName, type) => {
  const isTypePrice = type === 'Price';
  const mpScreen = isTypePrice ? 'Price List' : 'Craft List';
  const { items } = useSelector(isTypePrice ? selectPrice : selectCraft);
  const item = items.find(it => it.uniqueName === uniqueName);
  const resourceItem = item.kind === 'resource' || item.kind === 'basic_res' || item.kind === 'mount' || item.kind === 'supplies';
  return (
    <View>
      <View style={ styles.fmTopButtonsContainer }>
        <RequestTimerButton
          action={ () => {
            const mpEvent = isTypePrice ? 'Price Refresh' : 'Craft Refresh';
            dispatch(trackMixpanelEvent(mpEvent, { 'Unique Name' : uniqueName, Screen: mpScreen }));
            if (isTypePrice) {
              dispatch(getItemPrice(uniqueName));
              return;
            }
            if (resourceItem) {
              dispatch(getResourcesCraftItems(item));
              return;
            }
            dispatch(getCraftItems(uniqueName));
          } }
          title={ I18n.t('refresh') }
          loading={ item.loading }
          duration={ 60 }
        />
        { renderSeparator }
        <FMButton
          title={ I18n.t('remove') }
          loading={ false }
          action={ () => {
            const mpEvent = isTypePrice ? 'Price List Remove' : 'Craft List Remove';
            dispatch(trackMixpanelEvent(mpEvent, { 'Unique Name' : uniqueName, Screen: mpScreen }));
            dispatch(isTypePrice ? changePriceList(uniqueName) : changeCraftList(uniqueName));
          } }
          style={ styles.deleteButton }
          countAction= { false }
        />
      </View>
      <View style={ { flexDirection: 'row' } }>
        <FMButton
          title={ I18n.t('notifyPriceChange') }
          loading={ false }
          action={ () => {
            const mpEvent = isTypePrice ? 'Notify Price Change' : 'Notify Craft Change';
            dispatch(trackMixpanelEvent(mpEvent, { 'Unique Name' : uniqueName, Screen: mpScreen }));
            dispatch(showModalWithID({
              modalId: CONST.modal.message,
              data: { message: I18n.t('inDevelopment') }
            }));
          } }
          countAction= { false }
        />
      </View>
    </View>
  );
};

export const ActionPanel = ({ uniqueName, type }) => {
  const dispatch = useDispatch();
  const { items } = useSelector(selectSearch);
  const item = items.find(it => it.uniqueName === uniqueName);

  if (type === 'Search') {
    return renderActionPanelForSearch(dispatch, item, uniqueName);
  }
  if (type === 'Price' || type === 'Craft') {
    return renderActionPanelForPriceOrCraft(dispatch, uniqueName, type);
  }
  return null;
};

ActionPanel.propTypes = {
  uniqueName: PropType.string.isRequired,
  type: PropType.string.isRequired
};
