import { Platform } from 'react-native';
import {
  InterstitialAd, TestIds, AdEventType
} from '@react-native-firebase/admob';
import Config from 'react-native-config';
import { trackMixpanelEvent } from './mixpanel';

const iOSAdUnit = 'ca-app-pub-1372110447432206/6818771867';
const androidAdUnit = 'ca-app-pub-1372110447432206/5268024653';

const prodAddUnit = Platform.OS === 'ios' ? iOSAdUnit : androidAdUnit;
// eslint-disable-next-line no-undef
const adUnitId = Config.ENV === 'dev' ? TestIds.INTERSTITIAL : prodAddUnit;

export const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true
});

export const adListener = (
  onAdLoad, onAdClose, dispatch
) => interstitial.onAdEvent((type, error) => {
  if (type === AdEventType.LOADED) {
    onAdLoad();
  }
  if (type === AdEventType.CLOSED) {
    onAdClose();
    dispatch(trackMixpanelEvent('Admob', { 'AD Type': 'Interstitial', 'Event Action': 'Closed' }));
  }
  if (type === AdEventType.LEFT_APPLICATION) {
    dispatch(trackMixpanelEvent('Admob', { 'AD Type': 'Interstitial', 'Event Action': 'Left Application' }));
  }
  if (type === AdEventType.ERROR) {
    dispatch(trackMixpanelEvent('Admob', { 'AD Type': 'Interstitial', 'Event Action': 'Error', Error: error }));
  }
  if (error) {
    global.devLog('AD load error: ', error);
  }
});

export const loadAd = (onLoadedAlready) => {
  if (interstitial.loaded) {
    onLoadedAlready();
    return;
  }
  setTimeout(() => {
    interstitial.load();
  }, 3000);
};

export const showInterstitialAd = (onAdShown) => {
  interstitial.show()
    .then(() => {
      if (onAdShown) {
        onAdShown();
      }
    });
};
