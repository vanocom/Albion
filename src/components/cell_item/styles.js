import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backGround: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#D5CECC',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  container: {
    flexDirection: 'row',
    flex: 1
  },
  image: {
    width: 85,
    height: 85,
    marginRight: 20,
    marginVertical: 15
  },
  placeholderImage: {
    left: 0,
    right: 20,
    top: 15,
    bottom: 15,
    position: 'absolute'
  },
  itemName: {
    color: '#681A0B',
    fontWeight: '700',
    fontFamily: 'Helvetica',
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 8
  },
  rightContainer: {
    flexGrow: 1,
    flex: 1,
    marginVertical: 8
  },
  fmButton: {
    marginRight: 10
  },
  fmTopButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 10
  },
  prices: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imagesBlock: {
    justifyContent: 'space-evenly',
    flexDirection: 'row'
  },
  noItemsLabel: {
    fontFamily: 'Helvetica',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#681A0B'
  },
  errorLabel: {
    fontFamily: 'Helvetica',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#681A0B'
  }
});
