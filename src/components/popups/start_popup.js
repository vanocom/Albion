import I18n from 'i18n-js';
import React from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { renderAblionDataLink, renderMessageButtonOK } from '../common/popup';
import styles from './styles';

const StartPopup = () => {
  const dispatch = useDispatch();
  return (
    <View>
      <View style={ styles.startPopupContainer }>
        <Text style={ styles.startPopupTitle }>{I18n.t('startPopupText1')}</Text>
        <Text style={ styles.startPopupLabel }>
          {I18n.t('startPopupText2')}
          <Text style={ styles.specialText }>{I18n.t('startPopupText3')}</Text>
          <Text>{I18n.t('startPopupText4')}</Text>
          {renderAblionDataLink(dispatch)}
          <Text>{I18n.t('startPopupText5')}</Text>
        </Text>
        {renderMessageButtonOK()}
      </View>
    </View>
  );
};

export default StartPopup;
