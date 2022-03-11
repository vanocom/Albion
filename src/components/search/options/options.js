import {
  Text,
  TouchableOpacity,
  Image,
  View
} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import I18n from 'react-native-i18n';
import { useDispatch, useSelector } from 'react-redux';
import { optionsStyles as styles } from './styles';
import { selectSearch } from '../../../slices/search';
import { showModalWithID } from '../../../slices/modal';
import CONST from '../../../const/const';
import { FMButton } from '../../common';

const downArrow = require('../img/arrow_down.png');
const upArrow = require('../img/arrow_up.png');

export const MoreOptions = ({ opened, onToggle }) => (
  <View style={ styles.container }>
    <TouchableOpacity style={ styles.optionButton } onPress={ onToggle }>
      <Text style={ styles.moreOptionsText }>{ I18n.t('moreOpetions') }</Text>
      { opened && <Image source={ downArrow } style={ styles.moreOptionsImage } />}
      { !opened && <Image source={ upArrow } style={ styles.moreOptionsImage } />}
    </TouchableOpacity>
    <Options isOpened={ opened } />
  </View>
);

const OneOption = ({ title, value, modalId }) => {
  const dispatch = useDispatch();
  const buttonName = `${ title  }: ${  value }`;
  return (
    <View>
      <FMButton
        style = { styles.oneOptionButton }
        action = { () => dispatch(showModalWithID({ modalId })) }
        title = { buttonName }
        labelStyle = { styles.oneOptionButtonLabel }
        countAction={ false }
      />
    </View>
  );
};

OneOption.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  modalId: PropTypes.string.isRequired
};

const Options = ({ isOpened }) => {
  if (!isOpened) return null;
  const { ench, tier } = useSelector(selectSearch);
  return (
    <View style={ styles.optionsContainer }>
      <OneOption title={ I18n.t('tier') } value={ I18n.t(tier.displayValue, { defaultValue: tier.displayValue }) } modalId={ CONST.modal.tier } />
      <OneOption title={ I18n.t('ench') } value={ I18n.t(ench.displayValue, { defaultValue: ench.displayValue }) } modalId={ CONST.modal.ench } />
    </View>
  );
};

Options.propTypes = {
  isOpened: PropTypes.bool.isRequired
};

MoreOptions.propTypes = {
  opened: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};
