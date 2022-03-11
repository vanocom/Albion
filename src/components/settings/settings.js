import React from 'react';
import { View, Linking, Text } from 'react-native';
import I18n from 'react-native-i18n';
import { SettingItem } from '.';
import styles from './styles';
import CONST from '../../const/const';
import { version } from '../../../package.json';

const renderLanguageSection = (navigation) => (
  <View style={ styles.settingItemsContainer }>
    <SettingItem
      label={ I18n.t('language') }
      onPress={ () => navigation.navigate('LanguageSelection') }
    />
  </View>
);

const renderTermsAndPrivacySection = () => (
  <View style={ styles.settingItemsContainer }>
    {/* <SettingItem
      label={ I18n.t('termOfService') }
      onPress={ () => Linking.openURL(CONST.termOfServiceUrl) }
    /> */}
    <SettingItem
      label={ I18n.t('privacyPolicy') }
      onPress={ () => Linking.openURL(CONST.privacyPolicyUrl) }
    />
  </View>
);

const renderAboutUsSection = (navigation) => (
  <View style={ styles.settingItemsContainer }>
    <SettingItem
      label={ I18n.t('aboutUsTitle') }
      onPress={ () => navigation.navigate('AboutUs') }
    />
  </View>
);

export const Settings = ({ navigation }) => (
  <View style={ styles.container }>
    {renderLanguageSection(navigation)}
    {renderTermsAndPrivacySection()}
    {renderAboutUsSection(navigation)}
    <Text style={ styles.versionLabel }>Version {version} (576)</Text>
  </View>
);
