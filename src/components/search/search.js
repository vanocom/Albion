import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Linking
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import I18n from 'react-native-i18n';
import Autocomplete from './autocomplete';
import { selectSearch } from '../../slices/search';
import { selectSettings } from '../../slices/settings';
import CellItem from '../cell_item';
import styles from './styles';
import { MoreOptions } from './options/options';
import CONST from '../../const/const';
import { trackMixpanelEvent } from '../../utils/mixpanel';

const renderWelcomeLabel = () => (
  <Text style={ styles.welcomeLabel }>
    {I18n.t('title')}
  </Text>
);

const renderAlbionDataLabel = (dispatch) => (
  <Text style={ styles.albionDataLabel }>
    { I18n.t('poweredBy') }{'\n'}
    <Text
      onPress={ () => {
        dispatch(trackMixpanelEvent('Link Opened', { 'Link Type': 'Albion Data', Screen: 'Search' }));
        Linking.openURL(CONST.kAblionDataLink);
      } }
      style={ styles.albionDataLink }
    >
      { CONST.kAlbionDataLabel }
    </Text>
  </Text>
);

const renderClanLabel = (dispatch) => (
  <Text style={ styles.albionDataLabel }>
    Вступайте в лучшую русскоговорящую гильдию{ '\n' }
    <Text
      onPress={ () => {
        dispatch(trackMixpanelEvent('Link Opened', { 'Link Type': 'Guild', Screen: 'Search' }));
        Linking.openURL(CONST.kAvalonFarmersLink);
      } }
      style={ styles.albionDataLink }
    >
      AVALONFARMERS
    </Text>
  </Text>
);

const renderEmptyLabel = () => (
  <Text style={ styles.noItemsLabel }>{ I18n.t('noItemsFound') }</Text>
);

// eslint-disable-next-line max-lines-per-function
const renderItemsList = (items, menuOpened, navigation, setOnCenter, flatListRef) => (
  <FlatList
    data={ items }
    ref={ flatListRef }
    initialScrollIndex={ 0 }
    onScrollToIndexFailed={ info => {
      const wait = new Promise(resolve => setTimeout(resolve, 500));
      wait.then(() => {
        flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
      });
    } }
    style={ [styles.itemsList, { marginTop: menuOpened ? 180 : 120 }] }
    keyExtractor={ (item) => item.uniqueName }
    renderItem={ (item, num) => (
      <CellItem
        data={ item.item }
        key={ num }
        navigation={ navigation }
        tabType={ 'Search' }
      />
    ) }
    onScrollBeginDrag={ Keyboard.dismiss }
    onTouchStart={ () => {
      if (!items || items.length === 0) { setOnCenter(true); }
    } }
  />
);

const renderCenteredLayout = (setOnCenter, currentLoc, dispatch) => (
  <View style={ styles.centredContainer }>
    <View style={ styles.centredAutocompleteContainer }>
      { renderWelcomeLabel() }
      <TouchableOpacity
        style={ [styles.searchInput, { justifyContent: 'center' }] }
        onPress={ () => setOnCenter(false) }
      >
        <Text style={ styles.fakeLabel }> {I18n.t('inputPlaceHolder')}</Text>
      </TouchableOpacity>
      { renderAlbionDataLabel(dispatch) }
      { currentLoc === 'RU-RU' ? renderClanLabel(dispatch) : null }
    </View>
  </View>
);

// eslint-disable-next-line max-lines-per-function
const renderMainLayout = (
  items, menuOpened, toggleMenu, query, setQuery,
  onReturnKey, loading, navigation, setOnCenter, flatListRef
) => {
  const itemsNotFound = !loading && query !== '' && items.length === 0;
  const bottView = itemsNotFound ? renderEmptyLabel()
    : renderItemsList(items, menuOpened, navigation, setOnCenter, flatListRef);
  return (
    <View style={ styles.container }>
      <View style={ styles.autocompleteContainer }>
        <Autocomplete
          query={ query }
          setQuery={ setQuery }
          onReturnKey={  onReturnKey }
        />
      </View>
      <MoreOptions opened={ menuOpened } onToggle={ toggleMenu } />
      { bottView }
    </View>
  );
};

// eslint-disable-next-line max-lines-per-function
const Search = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    items, loading, updatedItemIndex, modifiedItemCellType
  } = useSelector(selectSearch);
  const { currentLoc } = useSelector(selectSettings);
  const [onCenter, setOnCenter] = useState(true);
  const [query, setQuery] = useState('');
  const [menuOpened, setMenuOpened] = useState(false);
  const toggleMenu = () => setMenuOpened(!menuOpened);
  const flatListRef = useRef(null);
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: updatedItemIndex
      });
    }
  }, [updatedItemIndex, modifiedItemCellType]);
  const onAutcomompleteReturn = () => {
    if (query === '') {
      setOnCenter(true);
    }
  };
  if (onCenter) {
    return renderCenteredLayout(setOnCenter, currentLoc, dispatch);
  }
  return renderMainLayout(
    items, menuOpened, toggleMenu, query, setQuery,
    onAutcomompleteReturn, loading, navigation, setOnCenter, flatListRef
  );
};

export default Search;
