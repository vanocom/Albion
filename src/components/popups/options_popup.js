import {
  Text,
  View
} from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import I18n from 'react-native-i18n';
import styles from './styles';
import {
  setTier, setQuality,
  setEnch, selectSearch
} from '../../slices/search';
import { filterSearchResults } from '../../slices/async_thuks';
import { selectModal, closeModal } from '../../slices/modal';
import { groupByColumns, getIdFromModalType } from '../../utils/utils';
import CONST from '../../const/const';
import { renderCloseButton } from '../common/popup';
import { FMButton } from '../common';

const tierDataSource = [
  { value: null, displayValue: 'any' },
  { value: 't1', displayValue: '1' },
  { value: 't2', displayValue: '2' },
  { value: 't3', displayValue: '3' },
  { value: 't4', displayValue: '4' },
  { value: 't5', displayValue: '5' },
  { value: 't6', displayValue: '6' },
  { value: 't7', displayValue: '7' },
  { value: 't8', displayValue: '8' }
];

const enchDataSource = [
  { value: null, displayValue: 'any' },
  { value: '@1', displayValue: '1' },
  { value: '@2', displayValue: '2' },
  { value: '@3', displayValue: '3' }
];

const qualityDataSource = [
  { value: null, displayValue: 'any' },
  { value: 'Normal', displayValue: 'Normal' },
  { value: 'Good', displayValue: 'Good' },
  { value: 'Outstanding', displayValue: 'Outstanding' },
  { value: 'Excellent', displayValue: 'Excellent' },
  { value: 'Masterpiece', displayValue: 'Masterpiece' }
];

const dataSource = {
  [CONST.modal.tier]: tierDataSource,
  [CONST.modal.quality]: qualityDataSource,
  [CONST.modal.ench]: enchDataSource
};

const action = {
  [CONST.modal.tier]: setTier,
  [CONST.modal.quality]: setQuality,
  [CONST.modal.ench]: setEnch
};

const renderOption = (value, idx, dispatch, modalId, searchText) => (
  <View
    style={ styles.fmButtonsContainer }
    key={ idx.toString() }
  >
    <FMButton
      style={ styles.option }
      action={ () => {
        dispatch(action[modalId](value));
        dispatch(closeModal());
        dispatch(filterSearchResults(searchText));
      } }
      title={ I18n.t(value.displayValue, { defaultValue: `${ value.displayValue }` }) }
      labelStyle={ styles.optionLabel }
      countAction={ false }
    />
  </View>
);

const renderRow = (row, index, dispatch, modalId, searchText) => {
  const buttons = row.map((value, idx) => renderOption(value, idx, dispatch, modalId, searchText));
  return (
    <View style={ styles.buttonsRow } key={ index.toString() }>
      { buttons }
    </View>
  );
};

const renderList = (modalId, dispatch, searchText) => {
  const arr = groupByColumns(dataSource[modalId], 3);
  const buttons = arr.map((row, index) => renderRow(row, index, dispatch, modalId, searchText));
  return (
    <View>
      <Text style={ styles.title }>{ I18n.t(getIdFromModalType(modalId))}</Text>
      <View>
        { buttons }
      </View>
    </View>
  );
};

const OptionsPopup = () => {
  const { modalId } = useSelector(selectModal);
  const { searchText } = useSelector(selectSearch);
  const dispatch = useDispatch();
  if (!modalId) return null;
  return (
    <View>
      {renderCloseButton()}
      { renderList(modalId, dispatch, searchText) }
    </View>
  );
};

export default OptionsPopup;
