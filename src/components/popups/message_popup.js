import React from 'react';
import { Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectModal } from '../../slices/modal';
import { renderAblionDataLink, renderMessageButtonOK } from '../common/popup';
import styles from './styles';

const MessagePopup = () => {
  const { data } = useSelector(selectModal);
  const dispatch = useDispatch();
  return (
    <View>
      <Text style={ styles.messageLabel }>
        {`${ data.message } `}
        { (data.showADLabel) ? renderAblionDataLink(dispatch) : null}
      </Text>
      {renderMessageButtonOK()}
    </View>
  );
};

export default MessagePopup;
