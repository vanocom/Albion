import {
  StyleSheet, Platform
} from 'react-native';

const albionFont = Platform.OS === 'ios' ? 'Koch Fette Deutsche Schrift' : 'Koch Fraktur';

export default StyleSheet.create({
  container: {
    backgroundColor: '#4C190B',
    flex: 1
  },
  centredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#4C190B',
    paddingHorizontal: 20
  },
  autocompleteContainer: {
    flex: 1,
    left: 20,
    position: 'absolute',
    right: 20,
    top: 24
  },
  centredAutocompleteContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center'
  },
  searchInput: {
    height: 44,
    backgroundColor: '#d5cecc',
    borderRadius: 8,
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: '700',
    paddingLeft: 8,
    paddingRight: 45
  },
  welcomeLabel: {
    fontFamily: albionFont,
    fontWeight: '400',
    fontSize: 32,
    color: '#D5CECC',
    textAlign: 'center',
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20
  },
  not_found_container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  not_found: {
    alignSelf: 'center',
    fontFamily: 'Helvetica',
    color: '#D5CECC',
    fontWeight: 'bold',
    fontSize: 20
  },
  fakeLabel: {
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: '700',
    color: '#83807E'
  },
  suggestedList: {
    maxHeight: 130,
    borderRadius: 8
  },
  suggestedItem: {
    height: 35,
    padding: 8,
    backgroundColor: '#D5CECC'
  },
  suggestedItemLabel: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold'
  },
  suggestedInputContainer: {
    borderWidth: 0,
    height: 44
  },
  itemsList: {
    zIndex: -1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 10
  },
  noItemsLabel: {
    textAlign: 'center',
    color: '#D5CECC',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 20,
    width: '100%',
    marginTop: 240
  },
  albionDataLabel: {
    fontSize: 14,
    color: '#D5CECC',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 20
  },
  albionDataLink: {
    textDecorationLine: 'underline',
    color: '#9B730E'
  },
  clearButton: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    width: 40,
    height: 40
  }
});
