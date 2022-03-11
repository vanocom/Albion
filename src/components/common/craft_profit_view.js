import React from 'react';
import {
  View, Text,
  TouchableOpacity, Image
} from 'react-native';
import I18n from 'react-native-i18n';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { ProfitPropType } from '../../proptypes/prop_types';
import { formatNumber } from '../../utils/utils';
import styles from './styles';
import { showModalWithID } from '../../slices/modal';
import CONST from '../../const/const';

const helpIcon = require('./img/help_icon.png');

export const renderProfitHeader = () => (
  <View style={ styles.craftProfitHeader }>
    <Text style={ styles.craftProfitCellHeaderCity }>{ I18n.t('city') }</Text>
    <Text style={ styles.craftProfitCellHeader }>{ I18n.t('buyDirectly') }</Text>
    <Text style={ styles.craftProfitCellHeader }>{ I18n.t('buyOrder') }</Text>
  </View>
);

const sellItemStyle = (sell) => [
  styles.craftProfitCell,
  styles.craftProfitCellPrice,
  sell > 0 ? styles.craftProfitLower : styles.craftProfitBigger
];

const buyItemStyle = (buy) => [
  styles.craftProfitCell,
  styles.craftProfitCellPrice, buy > 0 ? styles.craftProfitLower : styles.craftProfitBigger
];

const getPercentText = (value) => {
  if (value === 0 || Number.isNaN(value)) return 'NaN';
  if (value > 1000) return '> +1000%';
  if (value < -1000) return '< -1000%';

  const percentText = value.toFixed(2);
  const prefix = value > 0 ? '+' : '';
  return `${ prefix }${ percentText }%`;
};

export const renderItemProfitPrice = (data, index, size) => {
  if (!data) return null;
  const {
    sell, sellPercent, buy, buyPercent, city
  } = data;
  let bottomBorder;
  if (index !== size - 1) bottomBorder = styles.craftProfitBottomBorder;
  return (
    <View style={ [styles.craftProfitItemPrices, bottomBorder] } key={ index }>
      <Text style={ [styles.craftProfitCellCity] }>{ city }</Text>
      <Text style={ sellItemStyle(sell) }>{ sell === 0 ? 'N/A' : formatNumber(sell) }</Text>
      <Text style={ sellItemStyle(sellPercent) }>{ getPercentText(sellPercent) }</Text>
      <Text style={ buyItemStyle(buy) }>{ buy === 0 ? 'N/A' : formatNumber(buy) }</Text>
      <Text style={ buyItemStyle(buyPercent) }>{ getPercentText(buyPercent) }</Text>
    </View>
  );
};

// eslint-disable-next-line max-lines-per-function
export const CraftProfitView = ({ profits }) => {
  const dispatch = useDispatch();
  const pricing = profits.map((array, num) => renderItemProfitPrice(array, num, profits.length));
  if (!profits || profits.length === 0) {
    return null;
  }
  return (
    <View>
      <View style={ styles.craftProfitTitleView }>
        <Text style={ styles.craftProfitTitle }>{ I18n.t('profit') }</Text>
        <View style={ { marginLeft: 10 } }>
          <TouchableOpacity
            onPress={ () => {
              dispatch(showModalWithID({
                modalId: CONST.modal.message,
                data: { message: I18n.t('profitHelp'), showADLabel: true }
              }));
            } }
            style={ styles.craftProfitHelpIcon }
          >
            <Image source={ helpIcon } />
          </TouchableOpacity>
        </View>
      </View>
      { renderProfitHeader() }
      { pricing }
    </View>
  );
};

CraftProfitView.propTypes = {
  profits: PropTypes.arrayOf(ProfitPropType).isRequired
};
