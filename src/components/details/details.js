import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, Image, ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/native';
import I18n from 'react-native-i18n';
import CityCraft from '../city_craft';
import {
  CityPricesView, CraftListCTA, FMButton, PriceListCTA
} from '../common';
import {
  getItemPrice, getCraftItems, getResourcesCraftItems, updateActionsCount
} from '../../slices/async_thuks';
import { getInfoByUniqueName, getImageUrl, timeDifferenceMinute } from '../../utils/utils';
import { styles } from './styles';
import {
  selectDetails, setOnDetails
} from '../../slices/details';
import { selectSettings } from '../../slices/settings';
import { selectStorage } from '../../slices/storage';

const backIcon = require('./img/back_nav_arrow.png');
const kItemPlaceholder = require('../cell_item/img/item_placeholder.png');

const renderSeparator = <View style={ { width: 10 } } />;

const renderLoading = () => (
  <View style={ styles.loadingView }>
    <ActivityIndicator animating size="large" color="#681A0B" />
  </View>
);

const renderPriceItems = (prices) => {
  if (prices.length === 0) {
    return (
      <View style={ styles.loadingView }>
        <Text style={ styles.noItemsLabel }>{ I18n.t('noPricesInfo') }</Text>
      </View>
    );
  }
  return (
    <ScrollView style={ styles.priceItemsView }>
      <View style={ styles.priceItemsSubview }>
        <CityPricesView data={ prices } title={ I18n.t('prices') } showTitle={ false } />
      </View>
    </ScrollView>
  );
};

// eslint-disable-next-line max-lines-per-function
const renderErrorText = (data) => (
  <View style={ styles.loadingView }>
    <Text style={ styles.errorLabel }>
      { data.type === 'PRICE' ? data.priceError : data.craftError }
    </Text>
    <FMButton
      countAction={ false }
      title={ I18n.t('tryToRefresh') }
      style={ { marginTop: 10, flex: 0, flexGrow: 0 } }
      action={ () => {
        const { type, uniqueName, kind } = data;
        if (type === 'PRICE') {
          data.dispatch(getItemPrice(uniqueName));
          return;
        }
        if (kind === 'resource' || kind === 'basic_res' || kind === 'mount' || kind === 'supplies') {
          data.dispatch(getResourcesCraftItems(data));
          return;
        }
        data.dispatch(getCraftItems(uniqueName));
      } }
    />
  </View>
);

const renderPrices = (tabsData) => {
  const { cityPrices, priceLoading, priceError } = tabsData;
  if (priceError) {
    return renderErrorText({ ...tabsData, type: 'PRICE' });
  }
  const content = (priceLoading || !cityPrices) ? renderLoading() : renderPriceItems(cityPrices);
  return content;
};

const renderCraftList = (craftData) => {
  const { craftPrices, navigation } = craftData;
  if (craftPrices.length === 0) {
    return (
      <View style={ styles.loadingView }>
        <Text style={ styles.noItemsLabel }>{ I18n.t('noCityCraftInfo') }</Text>
      </View>
    );
  }
  const cityCraftData = { ...craftData, typeFrom: 'details' };
  return (
    <ScrollView style={ styles.priceItemsView }>
      <View style={ styles.priceItemsSubview }>
        <CityCraft payload={ cityCraftData } navigation={ navigation } />
      </View>
    </ScrollView>
  );
};

const renderCityCraft = (craftData) => {
  const { craftLoading, returnRateCraftPrices, craftError } = craftData;
  if (craftError) {
    return renderErrorText({ ...craftData, type: 'CRAFT' });
  }
  if (!craftData || !returnRateCraftPrices) {
    return renderLoading();
  }
  const content = craftLoading ? renderLoading() : renderCraftList(craftData);
  return content;
};

const switchToCraft = (switchData) => {
  const {
    setActiveTab, uniqueName, returnRateCraftPrices, dispatch, craftCheckDate, kind
  } = switchData;
  setActiveTab(1);
  dispatch(updateActionsCount());
  const minutePass = timeDifferenceMinute(craftCheckDate) >= 1;
  if (returnRateCraftPrices && returnRateCraftPrices.length > 0 && !minutePass) {
    return;
  }
  if (kind === 'resource' || kind === 'basic_res' || kind === 'mount' || kind === 'supplies') {
    dispatch(getResourcesCraftItems(switchData));
    return;
  }
  dispatch(getCraftItems(uniqueName));
};

const switchToPrice = (switchData) => {
  const {
    setActiveTab, uniqueName, dispatch, priceCheckDate
  } = switchData;
  setActiveTab(0);
  dispatch(updateActionsCount());
  const minutePass = timeDifferenceMinute(priceCheckDate) >= 1;
  if (!minutePass) {
    return;
  }
  dispatch(getItemPrice(uniqueName));
};

const renderPriceTab = (activeTab, switchData) => (
  <TouchableOpacity
    style={ [styles.tabButton, activeTab === 1 ? { backgroundColor: '#DB5F5F' } : null] }
    onPress={ () => switchToPrice(switchData) }
  >
    <Text style={ [styles.tabButtonLabel, activeTab === 1 ? { color: '#D5CECC' } : { color: '#681A0B' }] }>
      { I18n.t('prices') }
    </Text>
  </TouchableOpacity>
);

const craftLabel = (kind) => {
  switch (kind) {
    case 'resource':
      return I18n.t('refining');
    case 'basic_res':
      return I18n.t('transmutation');
    default:
      return I18n.t('craft');
  }
};

const renderCraftTab = (activeTab, switchData) => (
  <TouchableOpacity
    style={ [styles.tabButton, activeTab === 0 ? { backgroundColor: '#DB5F5F' } : null] }
    onPress={ () => switchToCraft(switchData) }
  >
    <Text style={ [styles.tabButtonLabel, activeTab === 0 ? { color: '#D5CECC' } : { color: '#681A0B' }] }>
      { craftLabel(switchData.kind) }
    </Text>
  </TouchableOpacity>
);

export const renderTabs = (tabsData) => {
  const [activeTab, setActiveTab] = useState(0);
  const switchData = { setActiveTab, ...tabsData };
  const bottomArea = activeTab === 0
    ? renderPrices(tabsData) : renderCityCraft(tabsData);
  return (
    <View style={ { flex: 1 } }>
      <View>
        <View style={ styles.tabsView }>
          { renderPriceTab(activeTab, switchData) }
          <View style={ styles.tabsVerticalSeparator } />
          { renderCraftTab(activeTab, switchData) }
        </View>
      </View>
      { bottomArea }
    </View>
  );
};

const renderNavBar = (navigation, name) => (
  <View style={ styles.navBar }>
    <TouchableOpacity
      onPress={ () => navigation.dispatch(StackActions.pop(1)) }
      style={ styles.backArrow }
    >
      <Image source={ backIcon } />
    </TouchableOpacity>
    <View style={ styles.navBarTitleView }>
      <Text style={ styles.navBarTitle }>{ name }</Text>
    </View>
  </View>
);

const renderDescription = (routeUniqueName, description) => (
  <View style={ styles.descriptionView }>
    <Image source={ kItemPlaceholder } style={ [styles.resourcePlaceholderImage, { left: 10 }] } />
    <FastImage
      source={ { uri: getImageUrl(routeUniqueName, 85), priority: FastImage.priority.normal } }
      style={ styles.image }
    />
    <Text style={ styles.titleText }>{ description }</Text>
  </View>
);

const renderButtons = (dispatch, detailsData) => (
  <View style={ styles.headerButtonsContainer }>
    { PriceListCTA(dispatch, detailsData, 'Details', styles.headerButtonLabel) }
    { renderSeparator }
    { CraftListCTA(dispatch, detailsData, 'Details', styles.headerButtonLabel) }
  </View>
);

const renderTopView = (routeUniqueName, description, dispatch, detailsData) => (
  <View>
    { renderDescription(routeUniqueName, description) }
    { renderButtons(dispatch, detailsData) }
  </View>
);

const onDetails = (payload) => {
  const { dispatch, routeUniqueName, tabDetails } = payload;
  const { cityPrices, uniqueName } = tabDetails;
  useEffect(() => {
    dispatch(updateActionsCount());
    dispatch(setOnDetails({ onDetails: true, uniqueName: routeUniqueName }));
    if (!tabDetails || (routeUniqueName !== uniqueName) || !cityPrices) {
      dispatch(getItemPrice(routeUniqueName));
    }
    return () => dispatch(setOnDetails({ onDetails: false, uniqueName: routeUniqueName }));
  }, []);
};

// eslint-disable-next-line max-lines-per-function
export const Details = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { uniqueName: routeUniqueName } = route.params;
  const { currentLoc } = useSelector(selectSettings);
  const { priceListUniqueNames, craftListUniqueNames } = useSelector(selectStorage);
  const detailsData = getInfoByUniqueName(routeUniqueName, currentLoc);
  detailsData.savedInPriceList = priceListUniqueNames.includes(detailsData.uniqueName);
  detailsData.savedInCraftList = craftListUniqueNames.includes(detailsData.uniqueName);
  const { name, description } = detailsData;
  const { details } = useSelector(selectDetails);
  const tabDetails = details.find(detail => detail.uniqueName === routeUniqueName) || {};
  onDetails({ tabDetails, dispatch, routeUniqueName });
  return (
    <View style={ styles.mainContainer }>
      { renderNavBar(navigation, name) }
      { renderTopView(routeUniqueName, description, dispatch, detailsData) }
      { renderTabs({
        ...detailsData, ...tabDetails, dispatch, navigation
      }) }
    </View>
  );
};
