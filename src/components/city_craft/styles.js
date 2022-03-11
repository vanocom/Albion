import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const rowWidth = windowWidth - 80;

export default StyleSheet.create({
  activeReceiptButton: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    marginRight: 3,
    borderColor: '#681A0B',
    borderWidth: 1,
    borderBottomWidth: 0,
    flexGrow: 1
  },
  disabledReceiptButton: {
    backgroundColor: '#681A0B',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    marginRight: 3,
    flexGrow: 1
  },
  activeReceiptLabel: {
    color: '#681A0B',
    paddingHorizontal: 8,
    paddingVertical: 10,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 14
  },
  disabledReceiptLabel: {
    color: '#D5CECC',
    paddingHorizontal: 8,
    paddingVertical: 10,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 14
  },
  receiptTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    maxWidth: '100%'
  },
  cityCraftContainer: {
    width: rowWidth
  }
});
