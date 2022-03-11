import I18n from 'i18n-js';
import React from 'react';
import { Text, View } from 'react-native';
import { FMButton } from '.';
import { getCraftItemsByIds, getItemPricesByIds } from '../../slices/async_thuks';
import styles from './styles';

// eslint-disable-next-line max-lines-per-function
const RequestError = (selector, dispatch) => (
  <View style={ styles.requestLoadingView }>
    <Text style={ styles.requestErrorLabel }>
      { selector.errorMessage }
    </Text>
    <View style={ styles.requestErrorButtonContainer }>
      <FMButton
        countAction={ false }
        title={ I18n.t('tryToRefresh') }
        labelStyle={ styles.requestErrorButtonRefresh }
        action={ () => {
          dispatch(selector.itemsType === 'PRICE'
            ? getItemPricesByIds(selector.items) : getCraftItemsByIds(selector.items));
        } }
      />
    </View>
  </View>
);

export default RequestError;
