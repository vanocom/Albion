import React from 'react';
import {
  Text, View
} from 'react-native';
import I18n from 'react-native-i18n';
import styles from './styles';

export const renderEmptyList = (onPressLink, listType) => (
  <View style={ styles.emptyItemContainer }>
    <Text style={ styles.emptyListLabel }>
      { I18n.t('kEmptyListLabelTitle') }
      { I18n.t('kEmptyListLabelSubtitle1') }
      <Text style={ styles.searchLink } onPress={ onPressLink }>
        { I18n.t('emptyListLabelSearch') }
      </Text>
      { I18n.t(listType === 'PriceList' ? 'kEmptyPriceListLabelSubtitle2' : 'kEmptyCraftListLabelSubtitle2') }
    </Text>
  </View>
);
