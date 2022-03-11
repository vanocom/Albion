import React from 'react';
import { View, Text } from 'react-native';
import I18n from 'react-native-i18n';
import PropTypes from 'prop-types';
import CONST from '../../const/const';
import styles from './styles';
import { FMButton } from '.';

export const renderRateHeader = () => (
  <View>
    <Text style={ styles.popupReturnRateTitle }>{ I18n.t('returnRate') }</Text>
    <View style={ styles.returnRateHeader }>
      <Text style={ [styles.returnRateCellHeader, styles.returnRateCellHeaderCity] } />
      <Text style={ styles.returnRateCellHeader }>{ I18n.t('regular') }</Text>
      <Text style={ styles.returnRateCellHeader }>{ I18n.t('focus') }</Text>
    </View>
  </View>
);

export const renderButton = (selectedRate, select, data) => (
  <View style={ styles.returRateRow } key={ data.text }>
    <Text style={ styles.returnRateCellCity } numberOfLines={ 1 } ellipsizeMode="tail">{I18n.t(data.text)}</Text>
    <FMButton
      title={ `${ data.regular.displayValue }%` }
      style={ selectedRate === data.regular.value
        ? styles.popupReturnRateActivatedButton : styles.popupReturnRateButton }
      action={ () => select(data.regular.value) }
      countAction={ false }
    />
    <FMButton
      title={ `${ data.focus.displayValue }%` }
      style={ selectedRate === data.focus.value
        ? styles.popupReturnRateActivatedButton : styles.popupReturnRateButton }
      action={ () => select(data.focus.value) }
      countAction={ false }
    />
  </View>
);

export const ReturnRatePicker = ({ selectedRate, select, kind }) => {
  const returnRateSource = kind === 'resource' ? CONST.resourceReturnRate : CONST.returnRate;
  const buttons = returnRateSource.map(obj => renderButton(selectedRate, select, obj));
  return (
    <View style={ styles.returRateContainer }>
      { renderRateHeader() }
      { buttons }
    </View>
  );
};

ReturnRatePicker.propTypes = {
  selectedRate: PropTypes.number.isRequired,
  select: PropTypes.func.isRequired,
  kind: PropTypes.string
};

ReturnRatePicker.defaultProps = {
  kind: null
};
