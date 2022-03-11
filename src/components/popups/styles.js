import {
  StyleSheet,
  Dimensions
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const customMargin = Math.floor(windowWidth * 0.05);
const buttonWidth = Math.floor((windowWidth - 40 - 16 - customMargin * 2) / 3);

export default StyleSheet.create({
  option: {
    width: buttonWidth,
    backgroundColor: '#681A0B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10
  },
  optionLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: '#D5CECC'
  },
  title: {
    fontFamily: 'Helvetica',
    fontWeight: '700',
    fontSize: 24,
    color: '#D5CECC',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 8
  },
  buttonsRow: {
    flexDirection: 'row',
    marginBottom: 25,
    marginHorizontal: 8,
    justifyContent: 'space-between'
  },
  messageLabel: {
    fontFamily: 'Helvetica',
    lineHeight: 25,
    fontWeight: '700',
    fontSize: 16,
    color: '#D5CECC',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    margin: 8,
    textAlign: 'center'
  },
  fmButtonsContainer: {
    marginBottom: 10,
    height: 40
  },
  startPopupTitle: {
    fontSize: 20,
    color: '#D27406',
    fontWeight: 'bold'
  },
  specialText: {
    fontSize: 17,
    fontFamily: 'Helvetica',
    color: '#D27406',
    fontWeight: 'bold'
  },
  startPopupContainer: {
    margin: 10,
    alignItems: 'center'
  },
  startPopupLabel: {
    marginTop: 20,
    color: '#D5CECC',
    lineHeight: 25,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    fontSize: 16,
    marginVertical: 7,
    alignSelf : 'center',
    textAlign: 'center',
    marginBottom: 20
  },
  countInputView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  countInput: {
    backgroundColor: '#D5CECC',
    height: 44,
    width: 100,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 20
  },
  countXLabel: {
    fontFamily: 'Helvetica',
    fontSize: 20,
    color: '#D5CECC',
    fontWeight: 'bold'
  }
});
