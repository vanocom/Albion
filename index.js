import { AppRegistry } from 'react-native';
import Bugsnag from '@bugsnag/react-native';
import App from './App';
import { name as appName } from './app.json';
import { devLog } from './src/utils/utils';

global.devLog = devLog;

devLog('=========================== APP STARTED ===========================');

Bugsnag.start();

AppRegistry.registerComponent(appName, () => App);
