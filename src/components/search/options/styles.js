import {
  StyleSheet
} from 'react-native';

export const optionsStyles = StyleSheet.create({
  optionsContainer: {
    borderRadius: 8,
    backgroundColor: 'rgba(196, 196, 196, 0.35)',
    flexDirection: 'row',
    padding: 5
  },
  moreOptionsText: {
    fontFamily: 'Helvetica',
    color: '#D5CECC',
    marginRight: 10,
    fontWeight: '700',
    fontSize: 16
  },
  container: {
    top: 70,
    right: 20,
    left: 20,
    position: 'absolute',
    zIndex: -1
  },
  moreOptionsImage: {
    justifyContent: 'center',
    alignContent: 'center'
  },
  oneOptionButton: {
    backgroundColor: '#681A0B',
    justifyContent: 'center',
    margin: 5,
    borderRadius: 8
  },
  oneOptionButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D5CECC',
    padding: 3
  },
  mainWrap: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start'
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    alignSelf: 'flex-end'
  }
});
