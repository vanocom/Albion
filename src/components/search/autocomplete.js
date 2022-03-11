import React, {
  useState
} from 'react';
import {
  useDispatch, useSelector
} from 'react-redux';
import {
  TextInput, TouchableOpacity, Text, Keyboard,
  View,
  Image
} from 'react-native';
import I18n from 'react-native-i18n';
import PropTypes from 'prop-types';
import Autocomplete from 'react-native-autocomplete-input';
import {
  selectSearch,
  searchStarted
} from '../../slices/search';
import { filterSearchResults } from '../../slices/async_thuks';
import styles from './styles';

const clearImage = require('./img/search_clear.png');

let searchTimer;

const renderSuggestionItem = (item, onSuggestionPress) => (
  <TouchableOpacity
    style={ styles.suggestedItem }
    onPress={ () => onSuggestionPress(item.item) }
  >
    <Text style={ styles.suggestedItemLabel }>
      { item.item }
    </Text>
  </TouchableOpacity>
);

const renderClearImage = (dispatch, setQuery) => (
  <TouchableOpacity
    style={ styles.clearButton }
    onPress={ () => {
      setQuery('');
      dispatch(filterSearchResults(''));
    } }
  >
    <Image source={ clearImage } />
  </TouchableOpacity>
);

const renderTextInput = (props, onReturn) => (
  <TextInput
    { ...props }
    onSubmitEditing={ onReturn }
    returnKeyType="done"
    placeholder={ I18n.t('inputPlaceHolder') }
    autoFocus
  />
);

const renderAutocompleteContent = (props, onReturn, query, setQuery, dispatch) => (
  <View>
    { renderTextInput(props, onReturn) }
    { query !== '' ? renderClearImage(dispatch, setQuery) : null }
  </View>
);

const flatListProps = (onSuggestionPress) => ({
  keyboardShouldPersistTaps: 'always',
  keyExtractor: (item, num) => num,
  renderItem: (item) => renderSuggestionItem(item, onSuggestionPress),
  style: styles.suggestedList
});

const onChangeQuery = (
  text, setQuery, loading, dispatch,
  setHideSuggestedList, suggested = false
) => {
  if (suggested) { Keyboard.dismiss(); }
  setHideSuggestedList(suggested);
  setQuery(text);
  if (!loading) {
    dispatch(searchStarted());
  }
  clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
    dispatch(filterSearchResults(text));
  }, suggested ? 0 : 150);
};

const autoCompleteStaticProps = ({
  autoCorrect: false,
  autoCapitalize: 'none',
  style: styles.searchInput,
  inputContainerStyle: styles.suggestedInputContainer
});

const autoCompleteProps = (suggestedItems, query, hideSuggestedList, onSuggestionPress) => ({
  data: suggestedItems && suggestedItems.length > 1 ? suggestedItems : [],
  value: query,
  hideResults: hideSuggestedList,
  flatListProps: flatListProps(onSuggestionPress)
});

const autoCompleteFunctions = (
  setQuery, loading, dispatch, setHideSuggestedList
) => ({
  onChangeText: (text) => onChangeQuery(text, setQuery, loading, dispatch, setHideSuggestedList),
  onFocus: () => setHideSuggestedList(false),
  onBlur: () => setHideSuggestedList(true)
});

// eslint-disable-next-line max-lines-per-function
const AutoComplete = ({ query, setQuery, onReturnKey }) => {
  const [hideSuggestedList, setHideSuggestedList] = useState(false);
  const { suggestedItems, loading } = useSelector(selectSearch);
  const dispatch = useDispatch();
  const hideSuggestions = () => { setHideSuggestedList(true); onReturnKey(); };
  const onSuggestionPress = (suggestion) => onChangeQuery(
    suggestion, setQuery, loading, dispatch, setHideSuggestedList, true
  );
  return (
    <View>
      <Autocomplete
        { ...autoCompleteStaticProps }
        { ...autoCompleteFunctions(setQuery, loading, dispatch, setHideSuggestedList) }
        { ...autoCompleteProps(suggestedItems, query, hideSuggestedList, onSuggestionPress) }
        renderTextInput={ (props) => renderAutocompleteContent(
          props, hideSuggestions, query, setQuery, dispatch
        )
        }
      />
    </View>
  );
};

AutoComplete.propTypes = {
  query: PropTypes.string,
  setQuery: PropTypes.func.isRequired,
  onReturnKey: PropTypes.func.isRequired
};

AutoComplete.defaultProps = {
  query: ''
};

export default AutoComplete;
