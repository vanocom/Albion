import I18n from 'i18n-js';
import React from 'react';
import { useSelector } from 'react-redux';
import { FMButton } from '.';
import CONST from '../../const/const';
import { changePriceList } from '../../slices/async_thuks';
import { showModalWithID } from '../../slices/modal';
import { selectStorage } from '../../slices/storage';
import { trackMixpanelEvent } from '../../utils/mixpanel';
import styles from './styles';

export const PriceListCTA = (dispatch, item, screen, labelStyle = null) => {
  const { priceListUniqueNames } = useSelector(selectStorage);
  return (
    <FMButton
      title={ item.savedInPriceList ? I18n.t('removeFromPriceList') : I18n.t('addToPriceList') }
      loading={ false }
      action={ () => {
        dispatch(trackMixpanelEvent(item.savedInPriceList ? 'Price List Remove' : 'Price List Add', { 'Unique Name' : item.uniqueName, Screen: screen }));
        const canChange = priceListUniqueNames.length < CONST.maxItemCountInStorageLists;
        if (canChange || item.savedInPriceList) {
          dispatch(changePriceList(item.uniqueName));
        } else {
          dispatch(showModalWithID({ modalId: CONST.modal.message, data: { message: I18n.t('maxCountInList') } }));
        }
      } }
      style={ item.savedInPriceList ? styles.deleteButton : '' }
      labelStyle={ labelStyle }
    />
  );
};

export default PriceListCTA;
