import React, { useEffect, useState, useRef } from 'react';
import {
  TouchableOpacity, Text, ViewPropTypes, ActivityIndicator, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import I18n from 'react-native-i18n';
import PropTypes from 'prop-types';
import { updateActionsCount } from '../../slices/async_thuks';
import { converSecontToMinutes } from '../../utils/utils';
import styles from './styles';

export const FMButton = ({
  title, action, style, labelStyle, loading, bColor, countAction = true
}) => {
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      style={ [styles.fmButton, { borderColor: bColor }, style] }
      title={ title }
      onPress={ () => {
        action();
        if (countAction) {
          dispatch(updateActionsCount());
        }
      } }
    >
      { loading && <ActivityIndicator size={ 12 } color="#fff" /> }
      { !loading && <Text style={ [styles.fmButtonTitle, labelStyle] }> { title } </Text> }
    </TouchableOpacity>
  );
};

const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return null;
  }, [delay]);
};

const onPress = (size, isRunning, action, countAction, dispatch) => {
  if (size > 0 && !isRunning) {
    action();
    if (countAction) {
      dispatch(updateActionsCount());
    }
  }
};

const resetTimer = (setCount, duration, setIsRunning, setRequest) => {
  setCount(duration);
  setIsRunning(false);
  setRequest(false);
};

// eslint-disable-next-line max-lines-per-function
export const RequestTimerButton = ({
  title, action, style, loading, duration, size = 1, countAction = true
}) => {
  const dispatch = useDispatch();
  const [count, setCount] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [request, setRequest] = useState(false);
  useInterval(() => { setCount(count - 1); }, isRunning ? 1000 : null);
  useEffect(() => {
    if (count < 1) { resetTimer(setCount, duration, setIsRunning, setRequest); }
  }, [count]);
  useEffect(() => { if (loading) setRequest(true); if (request) setIsRunning(true); }, [loading]);
  return (
    <TouchableOpacity
      style={ [styles.fmButton, style, isRunning ? styles.working : ''] }
      title={ title }
      onPress={ () => { onPress(size, isRunning, action, countAction, dispatch); } }
    >
      {loading && <ActivityIndicator size={ 12 } color="#fff" />}
      {!loading && (
      <View style={ styles.disactiveTitle }>
        <Text style={ [styles.fmButtonTitle] }>{ title }</Text>
        {isRunning && <Text style={ styles.time }>{ I18n.t('in')} { converSecontToMinutes(count) } </Text>}
      </View>
      )}
    </TouchableOpacity>
  );
};

export const TimerButton = ({
  title, size, style, duration, action, restart = false
}) => {
  const [count, setCount] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  useInterval(() => { setCount(count - 1); }, (isRunning) ? 1000 : null);
  useEffect(() => {
    if (count < 1 && restart) { action(); setCount(duration); }
  }, [count]);
  useEffect(() => { if (size === 0) { setIsRunning(false); setCount(duration); } }, [size]);
  return (
    <TouchableOpacity style={ [styles.fmButton, style, isRunning ? styles.working : ''] } title={ title } onPress={ () => { if (size > 0) setIsRunning(!isRunning); } }>
      <View style={ styles.disactiveTitle }>
        <Text style={ [styles.fmButtonTitle] }>{ title }</Text>
        <Text style={ styles.time }>{ I18n.t('in')} { converSecontToMinutes(count) } </Text>
      </View>
    </TouchableOpacity>
  );
};

RequestTimerButton.propTypes = {
  title: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  style: ViewPropTypes.style,
  loading: PropTypes.bool,
  countAction: PropTypes.bool,
  duration: PropTypes.number,
  size: PropTypes.number
};

RequestTimerButton.defaultProps = {
  style: null,
  loading: false,
  countAction: true,
  duration: 60,
  size: 1
};

FMButton.propTypes = {
  title: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  style: ViewPropTypes.style,
  labelStyle: Text.propTypes.style,
  loading: PropTypes.bool,
  countAction: PropTypes.bool,
  bColor: PropTypes.string
};

FMButton.defaultProps = {
  style: null,
  labelStyle: null,
  loading: false,
  countAction: true,
  bColor: '#D5CECC'
};
