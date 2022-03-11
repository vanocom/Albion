import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const imageNavigationArrow = require('./img/navigation_arrow.png');
const doneIcon = require('./img/done.png');

const renderIcon = (selected, type) => {
  if (!selected) return null;
  return (
    <Image
      source={ type === 'MAIN' ? imageNavigationArrow : doneIcon }
      style={ styles.settingItemImage }
    />
  );
};

export const SettingItem = ({
  label, onPress, type, selected
}) => (
  <TouchableOpacity
    style={ styles.settingItem }
    onPress={ onPress }
  >
    <Text style={ styles.settingItemText }> { label } </Text>
    { renderIcon(selected, type) }
  </TouchableOpacity>
);

SettingItem.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  type: PropTypes.string,
  selected: PropTypes.bool
};

SettingItem.defaultProps = {
  type: 'MAIN',
  selected: true
};
