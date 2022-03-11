import React, { useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { selectModal, closeModal } from '../../slices/modal';
import { changeProducedItemsCount } from '../../slices/craft_list';
import { changeProducedItemsCount as changeProducedItemsCountSearch } from '../../slices/search';
import { changeProducedItemsCount as changeProducedItemsCountDetails } from '../../slices/details';
import styles from './styles';

const producedItemsList = (uniqueName, count) => ({
  details: changeProducedItemsCountDetails({ uniqueName, count }),
  search: changeProducedItemsCountSearch({ uniqueName, count }),
  craftList: changeProducedItemsCount({ uniqueName, count })
});

const renderXLabel = (producedItemsCount) => {
  if (producedItemsCount === 1) {
    return null;
  }
  return (
    <View style={ { height: 44, marginLeft: 5 } }>
      <Text style={ styles.countXLabel }>
        {`x ${ producedItemsCount }`}
      </Text>
    </View>
  );
};

// eslint-disable-next-line max-lines-per-function
const ProducedItemsPopup = ({ inputRef }) => {
  const { data } = useSelector(selectModal);
  const {
    producedItemsCount, uniqueName, userProducedItemsCount, typeFrom
  } = data;
  const initValue = userProducedItemsCount ? userProducedItemsCount.toString() : '1';
  const [inputValue, setInputValue] = useState(initValue);
  const dispatch = useDispatch();
  console.log('INPUT REF', inputRef);
  return (
    <View>
      <Text style={ styles.messageLabel }>
        { I18n.t('changeProducedCount') }
      </Text>
      <View style={ styles.countInputView }>
        <TextInput
          style={ styles.countInput }
          autoFocus
          ref={ inputRef }
          keyboardType="number-pad"
          returnKeyType="done"
          value={ inputValue }
          maxLength={ 6 }
          onChangeText={ text => setInputValue(text) }
          onSubmitEditing={ (event) => {
            const val = parseInt(event.nativeEvent.text, 10);
            dispatch(producedItemsList(uniqueName, val)[typeFrom]);
            dispatch(closeModal());
          } }
        />
        { renderXLabel(producedItemsCount) }
      </View>
    </View>
  );
};

ProducedItemsPopup.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  inputRef: PropTypes.object.isRequired
};

export default ProducedItemsPopup;
