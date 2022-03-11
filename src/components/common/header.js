import React from 'react';
import {
  Text, View
} from 'react-native';
import I18n from 'react-native-i18n';
import styles from './styles';
import { RequestTimerButton } from './fm_button';

const renderItemsCount = (size, maxSize) => (
  <Text style={ styles.maxSizeText }>{size}/{maxSize}</Text>
);

export const renderListHeader = (maxSize, size, loading, action1) => (
  <View style={ styles.header }>
    <View style={ { width: 100 } } />
    {renderItemsCount(size, maxSize)}
    <RequestTimerButton
      style={ styles.headerButton }
      action={ () => { if (size > 0) action1(); } }
      size={ size }
      title={ I18n.t('refreshAll') }
      loading={ loading }
      duration={ 60 }
    />
  </View>
);
