import React, { useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { selectModal, closeModal } from '../../slices/modal';
import { changeItemCraftTax as changeCraftListCraftTax } from '../../slices/craft_list';
import { changeItemCraftTax as searchChangeCraftTax } from '../../slices/search';
import { changeItemCraftTax } from '../../slices/details';
import styles from './styles';

const taxRateList = (uniqueName, value) => ({
  details: changeItemCraftTax({ uniqueName, craftTax: value }),
  search: searchChangeCraftTax({ uniqueName, craftTax: value }),
  craftList: changeCraftListCraftTax({ uniqueName, craftTax: value })
});

// eslint-disable-next-line max-lines-per-function
const NutritionPopup = ({ inputRef }) => {
  const { data } = useSelector(selectModal);
  const {
    uniqueName, craftTax, typeFrom
  } = data;
  const [inputValue, setInputValue] = useState(craftTax === 0 ? '' : craftTax);
  const dispatch = useDispatch();
  return (
    <View>
      <Text style={ styles.messageLabel }>
        { I18n.t('usageFee') }
      </Text>
      <View style={ styles.countInputView }>
        <TextInput
          style={ styles.countInput }
          autoFocus
          ref={ inputRef }
          keyboardType="number-pad"
          returnKeyType="done"
          value={ inputValue.toString() }
          maxLength={ 4 }
          onChangeText={ text => setInputValue(text) }
          onSubmitEditing={ (event) => {
            const val = parseInt(event.nativeEvent.text, 10);
            dispatch(taxRateList(uniqueName, Number.isNaN(val) ? 0 : val)[typeFrom]);
            dispatch(closeModal());
          } }
        />
      </View>
    </View>
  );
};

NutritionPopup.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  inputRef: PropTypes.object.isRequired
};

export default NutritionPopup;
