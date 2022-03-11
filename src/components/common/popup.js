import React, { useEffect, useRef, useState } from 'react';
import {
  View, Modal, TouchableOpacity, Image, Text, Linking, Keyboard, Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { BlurView } from '@react-native-community/blur';
import styles from './styles';
import { selectModal, closeModal } from '../../slices/modal';
import CONST from '../../const/const';
import {
  OptionsPopup, ReturnRatePopup, MessagePopup,
  StartPopup, ProducedItemsPopup, NutritionPopup
} from '../popups';
import { FMButton } from '.';
import { trackMixpanelEvent } from '../../utils/mixpanel';

const closeIcon = require('./img/close.png');

const offset = 40;

const renderBlur = () => (
  <BlurView
    style={ styles.blurView }
    blurType="dark"
    blurAmount={ 5 }
  />
);

export const renderCloseButton = () => {
  const dispatch = useDispatch();
  return (
    <TouchableOpacity style={ styles.closeButton } onPress={ () => dispatch(closeModal()) }>
      <Image source={ closeIcon } />
    </TouchableOpacity>
  );
};

export const renderAblionDataLink = (dispatch) => (
  <Text
    onPress={ () => {
      dispatch(trackMixpanelEvent('Link Opened', { 'Link Type': 'Albion Data', Screen: 'Popup' }));
      Linking.openURL(CONST.kAblionDataLink);
    } }
    style={ styles.albionDataLink }
  >
    { CONST.kAlbionDataLabel }
  </Text>
);

export const renderMessageButtonOK = () => {
  const dispatch = useDispatch();
  return (
    <View style={ styles.messagePopupButtonContainer }>
      <FMButton
        style={ styles.messagePopupButtonOK }
        action={ () => dispatch(closeModal()) }
        countAction= { false }
        labelStyle={ styles.messagePopupButtonLabel }
        title={ 'OK' }
      />
    </View>
  );
};

const renderContent = (modalId, inputRef) => {
  switch (modalId) {
    case CONST.modal.tier:
    case CONST.modal.ench:
      return (<OptionsPopup />);
    case CONST.modal.returnRate:
      return (<ReturnRatePopup />);
    case CONST.modal.startPopup:
      return (<StartPopup />);
    case CONST.modal.message:
      return (<MessagePopup />);
    case CONST.modal.producedItems:
      return <ProducedItemsPopup inputRef={ inputRef } />;
    case CONST.modal.nutrition:
      return <NutritionPopup inputRef={ inputRef } />;
    default:
      return null;
  }
};

const trackKeyboardHeight = (setKeyboardOffset) => {
  const onKeyboardShow = event => setKeyboardOffset(event.endCoordinates.height);
  const onKeyboardHide = () => setKeyboardOffset(0);
  const keyboardDidShowListener = useRef();
  const keyboardDidHideListener = useRef();
  useEffect(() => {
    keyboardDidShowListener.current = Keyboard.addListener('keyboardWillShow', onKeyboardShow);
    keyboardDidHideListener.current = Keyboard.addListener('keyboardWillHide', onKeyboardHide);
    return () => {
      keyboardDidShowListener.current.remove();
      keyboardDidHideListener.current.remove();
    };
  }, []);
};

// eslint-disable-next-line max-lines-per-function
const Popup = () => {
  const inputRef = useRef(null);
  const { showModal, modalId } = useSelector(selectModal);
  const dispatch = useDispatch();
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  trackKeyboardHeight(setKeyboardOffset);
  const styleContainerAboveKeyboard = [
    styles.popUpContainerAboveKeyboard, { marginBottom: keyboardOffset + offset }
  ];
  if (!modalId) return null;
  return (
    <View>
      <Modal
        animationType="fade"
        transparent
        visible={ showModal }
        onRequestClose={ () => { } }
        onShow={ () => {
          setTimeout(() => {
            if (Platform.OS === 'android') {
              inputRef.current.blur();
              inputRef.current.focus();
            }
          }, 150);
        } }
      >
        { renderBlur() }
        <TouchableOpacity
          style={ keyboardOffset === 0 ? styles.popUpContainer : styleContainerAboveKeyboard }
          onPress={ () => dispatch(closeModal()) }
          activeOpacity={ 1 }
        >
          <TouchableOpacity
            activeOpacity={ 1 }
            style={ styles.innerContainer }
          >
            { renderContent(modalId, inputRef) }
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Popup;
