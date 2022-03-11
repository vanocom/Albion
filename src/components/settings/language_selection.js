import React, { useState } from 'react';
import {
  View, FlatList, Image
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/native';
import I18n from 'react-native-i18n';
import { useDispatch } from 'react-redux';
import { SettingItem } from '.';
import CONST from '../../const/const';
import styles from './styles';
import commonStyles from '../common/styles';
import { changeStorageData } from '../../slices/async_thuks';
import { FMButton } from '../common';

const doneIcon = require('./img/done.png');
const backIcon = require('../details/img/back_nav_arrow.png');

const renderBackButton = (navigation) => (
  <TouchableOpacity
    style={ styles.backButton }
    onPress={ () => {
      navigation.dispatch(StackActions.pop(1));
    } }
  >
    <Image source={ backIcon } />
  </TouchableOpacity>
);

const renderSaveButton = (currLanguage, dispatch) => (
  <FMButton
    style={ [styles.fmButton,
      I18n.locale === currLanguage
        ? commonStyles.headerDisabledButton : commonStyles.headerButton] }
    action={ () => dispatch(changeStorageData({ key:'currentLoc', value: currLanguage })) }
    title={ I18n.t('save') }
    labelStyle={ styles.settingSaveButtonText }
    countAction={ false }
  />
);

const renderLanguageList = (items, currLanguage) => (
  <FlatList
    data= { items }
    keyExtractor={ (languageItem) => languageItem.value }
    renderItem={ (languageItem) => (
      <SettingItem
        label={ languageItem.item.label }
        type="LANGUAGE"
        selected={ languageItem.item.value === currLanguage }
        onPress={ () => languageItem.item.action(languageItem.item) }
      />
    )
    }
  />
);

const renderHeader = (navigation, currLanguage, dispatch) => (
  <View style={ styles.headerContainer }>
    <View style={ commonStyles.header }>
      {renderBackButton(navigation)}
      {renderSaveButton(currLanguage, dispatch)}
    </View>
  </View>
);

const changeLanguageSelection = (langToChange, items, setItems, setCurrLanguage) => {
  const newItems = items.map(item => {
    if (langToChange.label === item.label) {
      setCurrLanguage(langToChange.value);
      return ({ ...item, imageSource: doneIcon });
    }
    return { ...item, imageSource: null };
  });
  setItems(newItems);
};

export const LanguageSelection = ({ navigation }) => {
  const dispatch = useDispatch();
  const [currLanguage, setCurrLanguage] = useState(I18n.locale);
  const [items, setItems] = useState(CONST.settingLanguages.map((languageItem) => ({
    label: languageItem.label,
    value: languageItem.value,
    action: (langItem) => changeLanguageSelection(langItem, items, setItems, setCurrLanguage)
  })));
  return (
    <View style={ styles.container }>
      {renderHeader(navigation, currLanguage, dispatch)}
      {renderLanguageList(items, currLanguage)}
    </View>
  );
};
