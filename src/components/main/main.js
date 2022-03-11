import React, { useEffect } from 'react';
import {
  SafeAreaView, Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import I18n from 'react-native-i18n';
import Search from '../search/search';
import Translation from '../../json/localization.json';
import { Settings, LanguageSelection, AboutUs } from '../settings';
import { PriceList } from '../price';
import { CraftList } from '../craft';
import { Details } from '../details';
import styles from './styles';
import { selectSettings, setLocalization, setAdLoaded } from '../../slices/settings';
import {
  loadStorageData, setInstallDate, showRateApp, changeStorageData, createItemsByUniqueNames
} from '../../slices/async_thuks';
import { identifyUser } from '../../utils/mixpanel';
import { selectStorage } from '../../slices/storage';
import { adListener, loadAd } from '../../utils/admob';
import Popup from '../common/popup';
import { setUpTranslation } from '../../utils/utils';
import { showModalWithID } from '../../slices/modal';
import CONST from '../../const/const';

const searchIcon = require('./img/search_tab.png');
const searchActiveIcon = require('./img/search_tab_active.png');

const priceListIcon = require('./img/price_list_icon.png');
const priceListActiveIcon = require('./img/price_list_active_icon.png');

const settingsActiveIcon = require('./img/settings_active_icon.png');
const settingsIcon = require('./img/settings_icon.png');

const craftListIcon = require('./img/craft_list_icon.png');
const craftListActiveIcon = require('./img/craft_list_active_icon.png');

const Tab = createBottomTabNavigator();

const getIconName = (routeName, focused) => {
  switch (routeName) {
    case I18n.t('search'):
      return focused ? searchActiveIcon : searchIcon;
    case I18n.t('priceList'):
      return focused ? priceListActiveIcon : priceListIcon;
    case I18n.t('craftList'):
      return focused ? craftListActiveIcon : craftListIcon;
    case I18n.t('settings'):
      return focused ? settingsActiveIcon : settingsIcon;
    default:
      return null;
  }
};

const screenOptions = ({ route }) => ({
  tabBarIcon: (icon) => {
    const { focused } = icon;
    const size = { width: 26, height: 26 };
    const iconName = getIconName(route.name, focused);

    return <Image source={ iconName } style={ size } />;
  }
});

const tabBarOptions = {
  style: styles.tabContainer,
  activeTintColor: '#9B730E',
  inactiveTintColor: '#D5CECC',
  labelStyle: styles.tabLabel
};

const Stack = createStackNavigator();

const SearchStack = () => (
  <Stack.Navigator
    screenOptions={ {
      headerShown: false,
      gestureEnabled: true,
      ...TransitionPresets.SlideFromRightIOS
    } }
  >
    <Stack.Screen name="Search" component={ Search } />
    <Stack.Screen name="Details" component={ Details } />
  </Stack.Navigator>
);

const PriceListStack = () => (
  <Stack.Navigator screenOptions={ {
    headerShown: false,
    gestureEnabled: true,
    ...TransitionPresets.SlideFromRightIOS
  } }
  >
    <Stack.Screen name="PriceList" component={ PriceList } />
    <Stack.Screen name="Details" component={ Details } />
  </Stack.Navigator>
);

const CraftListStack = () => (
  <Stack.Navigator screenOptions={ {
    headerShown: false,
    gestureEnabled: true,
    ...TransitionPresets.SlideFromRightIOS
  } }
  >
    <Stack.Screen name="CraftList" component={ CraftList } />
    <Stack.Screen name="Details" component={ Details } />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator screenOptions={ {
    headerShown: false,
    gestureEnabled: true,
    ...TransitionPresets.SlideFromRightIOS
  } }
  >
    <Stack.Screen name="Settings" component={ Settings } />
    <Stack.Screen name="LanguageSelection" component={ LanguageSelection } />
    <Stack.Screen name="AboutUs" component={ AboutUs } />
  </Stack.Navigator>
);

I18n.translations = Translation;

const renderTabs = () => (
  <Tab.Navigator tabBarOptions={ tabBarOptions } screenOptions={ screenOptions }>
    <Tab.Screen name={ I18n.t('search') } component={ SearchStack } />
    <Tab.Screen name={ I18n.t('priceList') } component={ PriceListStack } />
    <Tab.Screen name={ I18n.t('craftList') } component={ CraftListStack } />
    <Tab.Screen name={ I18n.t('settings') } component={ SettingsStack } />
  </Tab.Navigator>
);

// eslint-disable-next-line max-lines-per-function
const useEffects = (dispatch) => {
  const { currentLoc, installDate } = useSelector(selectSettings);
  const {
    loaded: storageLoaded, startPopupWasShowed, priceListUniqueNames, craftListUniqueNames
  } = useSelector(selectStorage);
  useEffect(() => {
    if (priceListUniqueNames.length > 0) {
      dispatch(createItemsByUniqueNames({ uniqueNames: priceListUniqueNames, typeFor: 'PriceList' }));
    }
  }, [priceListUniqueNames]);
  useEffect(() => {
    if (craftListUniqueNames.length > 0) {
      dispatch(createItemsByUniqueNames({ uniqueNames: craftListUniqueNames, typeFor: 'CraftList' }));
    }
  }, [craftListUniqueNames]);
  useEffect(() => {
    if (!storageLoaded) { return; }
    if (currentLoc === '') setUpTranslation(dispatch, setLocalization);
    if (!startPopupWasShowed) {
      dispatch(showModalWithID({
        modalId: CONST.modal.startPopup,
        data: { message: I18n.t('startPopup') }
      }));
      dispatch(changeStorageData({ key: 'startPopupWasShowed', value: JSON.stringify(true) }));
    }
    if (!installDate) {
      dispatch(setInstallDate());
    }
    dispatch(showRateApp());
    dispatch(identifyUser());
  }, [storageLoaded]);
  useEffect(() => {
    if (currentLoc) { SplashScreen.hide(); }
  }, [currentLoc]);
  useEffect(() => {
    const adEventListener = adListener(() => dispatch(setAdLoaded(true)), () => loadAd(), dispatch);
    loadAd(() => setAdLoaded(true));
    setUpTranslation(dispatch, setLocalization);
    dispatch(loadStorageData());
    return () => {
      adEventListener();
    };
  }, []);
};

export const Main = () => {
  const dispatch = useDispatch();
  useEffects(dispatch);
  return (
    <SafeAreaView style={ styles.container }>
      <NavigationContainer>
        { renderTabs() }
      </NavigationContainer>
      <Popup />
    </SafeAreaView>
  );
};
