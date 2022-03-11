import {
  StyleSheet
} from 'react-native';

export const styles = StyleSheet.create({
  mainContainer:{
    backgroundColor: '#4C190B',
    flex: 1
  },
  renderCraft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    color: '#D5CECC',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    marginLeft: 8,
    flex: 1
  },
  desc: {
    flexDirection: 'row'
  },
  descImage: {
    width: 85,
    height: 85
  },
  descTextContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  descText: {
    color: '#D5CECC'
  },
  priceBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20
  },
  imagesBlock: {
    justifyContent: 'space-evenly',
    flexDirection: 'row'
  },
  image: {
    width: 85,
    height: 85,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  tabsView: {
    height: 44,
    backgroundColor: '#D5CECC',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden'
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabButtonLabel: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 18
  },
  tabsVerticalSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: '#681A0B'
  },
  tabsHorizontalSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: '#681A0B'
  },
  resourcePlaceholderImage: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute'
  },
  loadingView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#D5CECC'
  },
  priceItemsView: {
    backgroundColor: '#D5CECC',
    flex: 1
  },
  priceItemsSubview: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 20,
    flex: 1,
    paddingHorizontal: 30
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  navBarTitleView: {
    flex: 1,
    justifyContent: 'center'
  },
  navBarTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D5CECC',
    fontFamily: 'Helvetica',
    marginHorizontal: 50
  },
  descriptionView: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 10
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
  },
  backArrow: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 5
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    marginHorizontal:10,
    marginBottom: 10,
    height: 40
  },
  headerButtonLabel: {
    fontSize: 15
  }
});
