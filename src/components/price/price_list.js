import { FlatList, View } from 'react-native';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPrice } from '../../slices/price_list';
import { getItemPricesByIds } from '../../slices/async_thuks';
import { renderListHeader, renderEmptyList } from '../common';
import styles from './styles';
import CellItem from '../cell_item';
import CONST from '../../const/const';
import RenderLoading from '../common/request_loading';
import RequestError from '../common/request_error';

const renderPriceCheckList = (items, navigation) => (
  <FlatList
    data={ items }
    keyExtractor={ (item) => item.uniqueName }
    renderItem={ (item, num) => (
      <CellItem
        data={ item.item }
        key={ num }
        tabType={ 'Price' }
        navigation={ navigation }
      />
    ) }
  />
);

const renderContent = (selector, navigation, dispatch) => {
  if (selector.loading) return RenderLoading();
  if (selector.error) return RequestError(selector, dispatch);
  return renderPriceCheckList(selector.items, navigation, dispatch);
};

const PriceList = ({ navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector(selectPrice);
  return (
    <View style={ styles.container }>
      {renderListHeader(
        CONST.maxItemCountInStorageLists,
        selector.items.length, selector.loading,
        () => { dispatch(getItemPricesByIds(selector.items)); }
      )}
      {
        selector.items.length > 0 ? renderContent(selector, navigation, dispatch) : renderEmptyList(() => navigation.navigate('Search'), 'PriceList')
      }
    </View>
  );
};

export default PriceList;
