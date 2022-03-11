import React from 'react';
import {
  View, Text, Image, TouchableOpacity
} from 'react-native';
import PropType from 'prop-types';
import FastImage from 'react-native-fast-image';
import { useSelector, useDispatch } from 'react-redux';
import I18n from 'react-native-i18n';
import { getItemPrice, getCraftItems, getResourcesCraftItems } from '../../slices/async_thuks';
import { ListItemPropType } from '../../proptypes/prop_types';
import { ActionPanel, CityPricesView, FMButton } from '../common';
import CityCraft from '../city_craft';
import styles from './styles';
import { selectSettings } from '../../slices/settings';

const kItemPlaceholder = require('./img/item_placeholder.png');

// eslint-disable-next-line max-lines-per-function
const renderErrorText = (data, dispatch) => (
  <View>
    <Text style={ styles.errorLabel }>
      { data.errorMessage }
    </Text>
    <FMButton
      countAction={ false }
      title={ I18n.t('tryToRefresh') }
      style={ { marginTop: 10 } }
      action={ () => {
        const { type, uniqueName, kind } = data;
        if (type === 'PRICE') dispatch(getItemPrice(uniqueName));
        if (type === 'CRAFT') {
          if (kind === 'resource' || kind === 'basic_res' || kind === 'mount' || kind === 'supplies') {
            dispatch(getResourcesCraftItems(data));
            return;
          }
          dispatch(getCraftItems(uniqueName));
        }
      } }
    />
  </View>
);

const renderBottomView = (data, tabType, dispatch, navigation) => {
  const {
    craftPrices, cityPrices, type, errorMessage
  } = data;
  if (errorMessage) return renderErrorText(data, dispatch);
  if (type === 'CRAFT') {
    if (!craftPrices) return null;
    if (craftPrices.length === 0) {
      return <Text style={ styles.noItemsLabel }>{ I18n.t('noCityCraftInfo') }</Text>;
    }
    const cityCraftData = { ...data, typeFrom: tabType === 'Search' ? 'search' : 'craftList' };
    return <CityCraft payload={ cityCraftData } navigation={ navigation } />;
  }
  if (type === 'PRICE') {
    if (!cityPrices) return null;
    if (cityPrices.length === 0) return <Text style={ styles.noItemsLabel }>{ I18n.t('noPricesInfo') }</Text>;
    return <CityPricesView data={ cityPrices } title={ I18n.t('prices') } type={ type } />;
  }
  return null;
};

const renderGeneralInfo = (imageUrl, name, uniqueName, currentLoc, tabType) => [
  <Image source={ kItemPlaceholder } style={ styles.placeholderImage } key="item_placehholder" />,
  <FastImage
    source={ { uri: imageUrl, priority: FastImage.priority.normal } }
    style={ styles.image }
    key="item_img"
  />,
  <View style={ styles.rightContainer } key="item_panel">
    <Text
      style={ styles.itemName }
      numberOfLines={ 2 }
      adjustsFontSizeToFit
    >
      { name[currentLoc] }
    </Text>
    <ActionPanel uniqueName={ uniqueName } type={ tabType } />
  </View>
];

const CellItem = ({ data, navigation, tabType }) => {
  const { currentLoc } =  useSelector(selectSettings);
  const {
    name, imageUrl, uniqueName
  } = data;
  const dispatch = useDispatch();
  return (
    <View style={ styles.backGround }>
      <TouchableOpacity
        style={ styles.container }
        onPress={ () => navigation.navigate('Details', { uniqueName }) }
      >
        { renderGeneralInfo(imageUrl, name, uniqueName, currentLoc, tabType) }
      </TouchableOpacity>
      <View style={ styles.prices }>
        { renderBottomView(data, tabType, dispatch, navigation) }
      </View>
    </View>
  );
};

CellItem.propTypes = {
  data: ListItemPropType.isRequired,
  tabType: PropType.string.isRequired
};

export default CellItem;
