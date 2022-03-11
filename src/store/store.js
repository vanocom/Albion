import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import Config from 'react-native-config';

import Search from '../slices/search';
import Storage from '../slices/storage';
import PriceList from '../slices/price_list';
import CraftList from '../slices/craft_list';
import Modal from '../slices/modal';
import Settings from '../slices/settings';
import DetailsSlice from '../slices/details';

const store = configureStore({
  reducer: {
    search: Search,
    storage: Storage,
    priceList: PriceList,
    craftList: CraftList,
    modal: Modal,
    settings: Settings,
    details: DetailsSlice
  },
  middleware: (getDefaultMiddleware) => (Config.ENV === 'dev' ? getDefaultMiddleware().concat(logger) : getDefaultMiddleware())
});

export default store;
