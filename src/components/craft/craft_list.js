import { FlatList, View } from 'react-native';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCraft } from '../../slices/craft_list';
import { getCraftItemsByIds } from '../../slices/async_thuks';
import { renderListHeader, renderEmptyList } from '../common';
import styles from './styles';
import CellItem from '../cell_item';
import CONST from '../../const/const';
import RenderLoading from '../common/request_loading';
import RequestError from '../common/request_error';

const renderCraftCheckList = (craftSelector, navigation) => (
  <FlatList
    data={ craftSelector.items }
    keyExtractor={ (item) => item.uniqueName }
    renderItem={ (item, num) => (
      <CellItem
        data={ item.item }
        key={ num }
        tabType={ 'Craft' }
        navigation={ navigation }
      />
    ) }
  />
);

const renderContent = (selector, navigation, dispatch) => {
  if (selector.loading) return RenderLoading();
  if (selector.error) return RequestError(selector, dispatch);
  return renderCraftCheckList(selector, navigation);
};

const CraftList = ({ navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector(selectCraft);
  return (
    <View style={ styles.container }>
      {renderListHeader(
        CONST.maxItemCountInStorageLists,
        selector.items.length,
        selector.loading,
        () => { dispatch(getCraftItemsByIds(selector.items)); }
      )}
      { selector.items.length > 0 ? renderContent(selector, navigation, dispatch) : renderEmptyList(() => navigation.navigate('Search'), 'CraftList') }
    </View>
  );
};

export default CraftList;
