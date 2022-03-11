import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import styles from './styles';

export const RenderLoading = () => (
  <View style={ styles.requestLoadingView }>
    <ActivityIndicator animating size="large" color="#D5CECC" />
  </View>
);

export default RenderLoading;
