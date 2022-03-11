/* eslint-disable max-len */
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image
} from 'react-native';
import I18n from 'react-native-i18n';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { PricePropType } from '../../proptypes/prop_types';
import { timeDifference, formatNumber } from '../../utils/utils';
import styles from './styles';
import { showModalWithID } from '../../slices/modal';
import CONST from '../../const/const';

const helpIcon = require('./img/help_icon.png');
const helpIconForButton = require('./img/help_icon_for_button.png');
const upArrow = require('../search/img/arrow_up.png');
const downArrow = require('./img/down_arrow_active.png');

export const renderPriceHeader = () => (
  <View style={ styles.cityPriceHeader }>
    <Text style={ styles.cityPriceCellHeaderCity }>{ I18n.t('city') }</Text>
    <Text style={ styles.cityPriceCellHeader } ellipsizeMode="tail">{ I18n.t('sellDate') }</Text>
    <Text style={ styles.cityPriceCellHeader }>{ I18n.t('sell') }</Text>
    <Text style={ styles.cityPriceCellHeader }>{ I18n.t('buyDate') }</Text>
    <Text style={ styles.cityPriceCellHeader }>{ I18n.t('buy') }</Text>
  </View>
);

export const renderButtonHelp = (dispatch, type, icon) => (
  <TouchableOpacity
    style={ styles.cityPriceHelpIcon }
    onPress={ () => {
      dispatch(showModalWithID({
        modalId: CONST.modal.message,
        data: { message: type === 'PRICE' ? I18n.t('ricesHelp') : I18n.t('craftPriceHelp'), showADLabel: true  }
      }));
    } }
  >
    <Image source={ icon } style={ { alignSelf: 'center' } } />
  </TouchableOpacity>
);

const timeColorStyle = [styles.cityPriceDays, styles.cityPriceHours, styles.cityPriceMinutes];

const getPriceStyle = (value, data) => {
  if (data.minValue === data.maxValue || value === 0) return [styles.cityPriceCellPrice, { color: 'black' }];

  switch (value) {
    case data.minValue:
      return styles.cityPriceCellMinPrice;
    case data.maxValue:
      return styles.cityPriceCellMaxPrice;
    default:
      return [styles.cityPriceCellPrice, { color: 'black' }];
  }
};

// eslint-disable-next-line max-lines-per-function
export const renderItemCityPrice = (data, index, size, minMaxValues) => {
  const {
    city, sellDate, sell, buyDate, buy
  } = data;
  const sellTime = timeDifference(sellDate);
  const buyTime = timeDifference(buyDate);
  let bottomBorder;
  const sellStyle = getPriceStyle(sell, minMaxValues.sellValues);
  const buyStyle = getPriceStyle(buy, minMaxValues.buyValues);
  if (index !== size - 1) bottomBorder = styles.cityPriceBottomBorder;
  return (
    <View style={ [styles.cityPriceItemPrices, bottomBorder] } key={ index }>
      <Text style={ [styles.cityPriceCellCity] }>{ city }</Text>
      <Text style={ [styles.cityPriceCell, timeColorStyle[sellTime.style]] }>
        { sellTime.value }
      </Text>
      <Text style={ [styles.cityPriceCell, sellStyle] }>{ sell === 0 ? 'N/A' : formatNumber(sell) }</Text>
      <Text style={ [styles.cityPriceCell, timeColorStyle[buyTime.style]] }>{ buyTime.value }</Text>
      <Text style={ [styles.cityPriceCell, buyStyle] }>{ buy === 0 ? 'N/A' : formatNumber(buy) }</Text>
    </View>
  );
};

const renderLabelTitle = (title, dispatch, type) => (
  <View style={ styles.cityPriceTitleView }>
    <Text style={ styles.cityPriceTitle }>{ title }</Text>
    { renderButtonHelp(dispatch, type, helpIcon) }
  </View>
);

const renderButtonTitle = (title, dispatch, type, displayPrices, setDisplayPrices) => (
  <TouchableOpacity
    style={ displayPrices
      ? styles.cityCraftSectionButtonViewActive : styles.cityCraftSectionButtonView }
    onPress={ () => setDisplayPrices(!displayPrices) }
  >
    <View style={ styles.cityCraftSectionButtonContainer }>
      <Text style={ displayPrices
        ? styles.cityPriceTitle : styles.cityCraftSectionButtonTitle }
      >{ title }
      </Text>
      { renderButtonHelp(dispatch, type, displayPrices ? helpIcon : helpIconForButton) }
    </View>
    <Image
      source={ displayPrices ? downArrow : upArrow }
      style={ { alignSelf: 'center' } }
    />
  </TouchableOpacity>
);

const renderTitle = (showTitle, title, dispatch, type, dispPrices, setDispPrices, isLabelTitle) => {
  if (!showTitle) return null;
  if (isLabelTitle) return renderLabelTitle(title, dispatch, type);
  return renderButtonTitle(title, dispatch, type, dispPrices, setDispPrices);
};

const getMinMaxValues = (data) => {
  const sellMinValue = Math.min(...data.map((o) => o.sell).filter((o) => !Number.isNaN(o) && o !== 0));
  const sellMaxValue = Math.max(...data.map((o) => o.sell).filter((o) => !Number.isNaN(o) && o !== 0));
  const buyMinValue = Math.min(...data.map((o) => o.buy).filter((o) => !Number.isNaN(o) && o !== 0));
  const buyMaxValue = Math.max(...data.map((o) => o.buy).filter((o) => !Number.isNaN(o) && o !== 0));
  return {
    sellValues: { minValue: sellMinValue, maxValue: sellMaxValue },
    buyValues: { minValue: buyMinValue, maxValue: buyMaxValue }
  };
};

export const CityPricesView = ({
  data, title, showTitle = true, type, showLabelTitle = true
}) => {
  const [dispPrices, setDispPrices]  = useState(showLabelTitle);
  const minMaxValues = getMinMaxValues(data);
  const pricing = data.map((array, num) => renderItemCityPrice(
    array, num, data.length, minMaxValues
  ));
  const dispatch = useDispatch();
  return (
    <View>
      { renderTitle(showTitle, title, dispatch, type, dispPrices, setDispPrices, showLabelTitle) }
      { dispPrices || !showTitle ? renderPriceHeader() : null}
      { dispPrices || !showTitle ? pricing : null}
    </View>
  );
};

CityPricesView.propTypes = {
  data: PropTypes.arrayOf(PricePropType).isRequired,
  title: PropTypes.string.isRequired,
  showTitle: PropTypes.bool,
  showLabelTitle: PropTypes.bool,
  type: PropTypes.string,
  typeFrom: PropTypes.string

};

CityPricesView.defaultProps = {
  showTitle: true,
  showLabelTitle: true,
  type: '',
  typeFrom: ''
};
