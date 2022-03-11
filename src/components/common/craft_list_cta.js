import I18n from 'i18n-js';
import React from 'react';
import { useSelector } from 'react-redux';
import { FMButton } from '.';
import CONST from '../../const/const';
import { changeCraftList } from '../../slices/async_thuks';
import { showModalWithID } from '../../slices/modal';
import { selectStorage } from '../../slices/storage';
import { trackMixpanelEvent } from '../../utils/mixpanel';
import styles from './styles';

export const CraftListCTA = (dispatch, item, screen, labelStyle = null) => {
  const { craftListUniqueNames } = useSelector(selectStorage);
  return (
    <FMButton
      title={ item.savedInCraftList ? I18n.t('removeFromCraftList') : I18n.t('addToCraftList') }
      loading={ false }
      action={ () => {
        dispatch(trackMixpanelEvent(item.savedInCraftList ? 'Craft List Remove' : 'Craft List Add', { 'Unique Name' : item.uniqueName, Screen: screen }));
        const canChange = craftListUniqueNames.length < CONST.maxItemCountInStorageLists;
        if (canChange || item.savedInCraftList) {
          dispatch(changeCraftList(item.uniqueName));
        } else {
          dispatch(showModalWithID({ modalId: CONST.modal.message, data: { message: I18n.t('maxCountInList') } }));
        }
      } }
      style={ item.savedInCraftList ? styles.deleteButton : '' }
      labelStyle={ labelStyle }
    />
  );
};

export default CraftListCTA;
