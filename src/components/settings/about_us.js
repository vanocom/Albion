import React from 'react';
import {
  View, Image,
  Text,
  Linking, ScrollView, Platform
} from 'react-native';
import { useDispatch } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/native';
import I18n from 'react-native-i18n';
import styles from './styles';
import CONST from '../../const/const';
import { trackMixpanelEvent } from '../../utils/mixpanel';

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

const renderLink = (dispatch) => {
  const url = Platform.OS === 'ios' ? CONST.kCifIOSLink : CONST.kCifAndroidLink;
  return (
    <Text
      onPress={ () => {
        dispatch(trackMixpanelEvent('Link Opened', { 'Link Type': 'Core In Fusion', Screen: `About Us(${ Platform.OS })` }));
        Linking.openURL(url);
      } }
      style={ styles.link }
    >
      Core In Fusion
    </Text>
  );
};

const renderHeader = (navigation) => (
  <View>
    <View style={ styles.aboutUsHeader }>
      {renderBackButton(navigation)}
    </View>
  </View>
);

const renderData = (dispatch) => (
  <View style={ styles.aboutUsDataContainer }>
    <Text style={ styles.aboutUsDataText }>
      {I18n.t('aboutUs')}
      <Text style={ styles.selectedText }>yarik.idy@gmail.com</Text>
    </Text>
    <Text style={ styles.aboutUsDataText }>
      {I18n.t('playWithUs')}
      <Text style={ styles.selectedText }>BigRushFarm</Text>
    </Text>
    <Text style={ styles.aboutUsDataText }>{I18n.t('checkOurGame')}</Text>
    <View style={ styles.linksContainer }>
      { renderLink(dispatch) }
    </View>
  </View>
);

export const AboutUs = ({ navigation }) => {
  const dispatch = useDispatch();
  return (
    <View style={ styles.container }>
      { renderHeader(navigation) }
      <ScrollView>
        { renderData(dispatch) }
      </ScrollView>
    </View>
  );
};
