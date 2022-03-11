import React, { useState } from 'react';
import {
  View, TouchableOpacity, Image, Text
} from 'react-native';
import PropType from 'prop-types';
import FastImage from 'react-native-fast-image';
import { StackActions } from '@react-navigation/native';
import I18n from 'react-native-i18n';
import { getImageUrl, groupByColumns } from '../../utils/utils';
import styles from './styles';
import { CraftItemsPropType } from '../../proptypes/prop_types';

const kItemPlaceholder = require('../cell_item/img/item_placeholder.png');
const upArrow = require('../search/img/arrow_up.png');
const downArrow = require('./img/down_arrow_active.png');

// eslint-disable-next-line max-lines-per-function
const renderCraftItem = (data) => {
  const {
    item, navigation, userProducedItemsCount
  } = data;
  const count = item.count * (userProducedItemsCount || 1);
  return (
    <View style={ styles.craftItemsImages } key={ item.uniqueName }>
      <TouchableOpacity
        onPress={ () => {
          navigation.dispatch(StackActions.push('Details', { uniqueName: item.uniqueName }));
        } }
      >
        <Image source={ kItemPlaceholder } style={ styles.craftItemsResourcePlaceholderImage } />
        <FastImage
          source={ {
            uri: getImageUrl(item.uniqueName, 85), priority: FastImage.priority.normal
          } }
          style={ styles.craftItemsImage }
        />
      </TouchableOpacity>
      <Text style={ styles.craftItemsResourceCountLabel }>{ count }</Text>
    </View>
  );
};

const renderItemsRow = (data) => {
  const { row, index  } = data;
  const buttons = row.map(item => renderCraftItem({ item, ...data }));
  return (
    <View style={ styles.itemsNeededRow } key={ index.toString() }>
      { buttons }
    </View>
  );
};

const renderButtonTitle = (dispItems, setDispItems) => (
  <TouchableOpacity
    style={ [dispItems
      ? styles.cityCraftSectionButtonViewActive : styles.cityCraftSectionButtonView,
    { marginTop: 15 }] }
    onPress={ () => setDispItems(!dispItems) }
  >
    <View style={ styles.cityCraftSectionButtonContainer }>
      <Text style={ dispItems
        ? styles.cityPriceTitle : styles.cityCraftSectionButtonTitle }
      >{ I18n.t('itemsNeeded') }
      </Text>
    </View>
    <Image
      source={ dispItems ? downArrow : upArrow }
      style={ { alignSelf: 'center' } }
    />
  </TouchableOpacity>
);

const renderItems = (data) => {
  const { craftItems, dispItems } = data;
  if (!dispItems) return null;
  const itemsArr = groupByColumns(craftItems, 3);
  const items = itemsArr.map((row, index) => renderItemsRow({ row, index, ...data }));
  return (
    <View style={ styles.craftItemsResourcesContainer }>
      { items }
    </View>
  );
};

export const CraftItems = (props) => {
  const [dispItems, setDispItems]  = useState(false);
  return (
    <View>
      { renderButtonTitle(dispItems, setDispItems) }
      { renderItems({ ...props, dispItems }) }
    </View>
  );
};

CraftItems.propTypes = {
  craftItems: CraftItemsPropType.isRequired,
  userProducedItemsCount: PropType.number
};

CraftItems.defaultProps = {
  userProducedItemsCount: null
};
