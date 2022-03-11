/* eslint-disable max-lines */
import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const buttonWidth = (windowWidth) * 0.33;
const rowWidth = windowWidth - 80;
const cellWidth = rowWidth / 4;
const cityWidth = rowWidth / 2;
const priceCellWidth = rowWidth * 0.1875;
const priceCityCell = rowWidth * 0.25;

export default StyleSheet.create({
  fmButton: {
    backgroundColor: '#681A0B',
    borderRadius: 8,
    padding: 4,
    flexGrow: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D5CECC',
    borderWidth: 1
  },
  fmButtonTitle: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#D5CECC'
  },
  fmButtonReturnRateContainer: {
    alignSelf: 'stretch',
    minHeight: 40,
    marginVertical: 15
  },
  fmButtonReturnProducedItems: {
    alignSelf: 'stretch',
    minHeight: 40,
    marginTop: 5
  },
  diactiveBlock: {
    alignItems: 'center'
  },
  working: {
    backgroundColor: 'grey'
  },
  disactiveTitle: {
    // flex: 1,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  time: {
    color: '#D5CECC',
    fontSize: 16
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10
  },
  maxSizeText: {
    fontFamily: 'Helvetica',
    fontWeight: '700',
    fontSize: 16,
    color: '#D5CECC',
    textAlign: 'center'
  },
  headerButton: {
    backgroundColor: '#9B730E',
    justifyContent: 'center',
    height: 44,
    flexGrow: 0,
    flex: 0,
    width: 100
  },
  headerDisabledButton: {
    backgroundColor: 'grey',
    justifyContent: 'center',
    height: 44,
    flexGrow: 0,
    flex: 0,
    width: 100
  },
  buttonText: {
    fontWeight: '700',
    fontFamily: 'Helvetica',
    fontSize: 16,
    color: '#D5CECC',
    textAlign: 'center'
  },
  emptyItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyListLabel: {
    textAlign: 'center',
    color: '#D5CECC',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Helvetica'
  },
  searchLink: {
    textDecorationLine: 'underline',
    color: '#9B730E'
  },
  buttonsContainer: {
    flexDirection: 'column'
  },
  fmTopButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 10
  },
  fmBottomButtonsContainer: {

  },
  deleteButton: {
    backgroundColor: '#B73D1C'
  },
  popupReturnRateButton: {
    marginRight: 5,
    marginLeft: 5
  },
  popupReturnRateActivatedButton: {
    marginRight: 5,
    marginLeft: 5,
    backgroundColor: '#B73D1C'
  },
  popupReturnRateLabel: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center'
  },
  taxSliderTitle: {
    width: rowWidth,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#681A0B'
    // marginBottom: 5
  },
  taxSlider: {
    height: 40
  },
  returRateContainer: {
    marginBottom: 20
  },
  returRateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginLeft: 20,
    marginRight: 20
  },
  returnRateCell: {
    width: cellWidth,
    flexDirection: 'row'
  },
  returnRateValue: {
    fontFamily: 'Helvetica',
    fontWeight: '700',
    fontSize: 11
  },
  returnRateCellCity: {
    textAlignVertical: 'center',
    width: cityWidth,
    fontFamily: 'Helvetica',
    fontWeight: '700',
    color: '#D5CECC',
    fontSize: 16
  },
  returnRateHeader: {
    width: rowWidth,
    flexDirection: 'row',
    justifyContent:'space-between',
    marginBottom: 5,
    alignSelf: 'flex-end',
    alignItems: 'center'
  },
  returnRateCellHeader: {
    width: cellWidth,
    fontFamily: 'Helvetica',
    fontWeight: '700',
    color: '#D5CECC',
    fontSize: 12
  },
  returnRateCellHeaderCity: {
    width: cityWidth
  },
  returnRateImg: {
    width: 15,
    height: 15,
    marginRight: 3
  },
  craftReturnRateTitle: {
    width: rowWidth,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#681A0B',
    marginBottom: 5
  },
  popupReturnRateTitle: {
    fontFamily: 'Helvetica',
    fontWeight: '700',
    fontSize: 24,
    color: '#D5CECC',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 8
  },
  cityPriceTitle: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: '#681A0B'
  },
  cityPriceHeader: {
    width: rowWidth,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    paddingBottom: 5
  },
  cityPriceCellHeader: {
    width: priceCellWidth,
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '700',
    fontFamily: 'Helvetica',
    textAlign: 'right',
    paddingLeft: 3
  },
  cityPriceCellHeaderCity: {
    width: priceCityCell,
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '700',
    fontFamily: 'Helvetica'
  },
  cityPriceItemPrices: {
    width: rowWidth,
    flexDirection: 'row',
    justifyContent:'space-between',
    marginVertical: 1,
    alignItems: 'center'
  },
  cityPriceBottomBorder: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1
  },
  cityPriceCell: {
    width: priceCellWidth,
    fontFamily: 'Helvetica',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'right',
    paddingLeft: 3
  },
  cityPriceCellCity: {
    width: priceCityCell,
    fontFamily: 'Helvetica',
    fontSize: 11
  },
  cityPriceCellPrice: {
    fontWeight: 'bold'
  },
  cityPriceCellMinPrice: {
    color: 'green',
    fontWeight: 'bold'
  },
  cityPriceCellMaxPrice: {
    color: 'red',
    fontWeight: 'bold'
  },
  cityPriceDays: {
    color: 'red'
  },
  cityPriceHours: {
    color: '#CC6600'
  },
  cityPriceMinutes: {
    color: 'green'
  },
  cityPriceList: {
    flex: 1
  },
  cityPriceTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  },
  cityPriceHelpIcon: {
    justifyContent: 'center',
    width: 40,
    height: 40
  },
  craftProfitTitle: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: '#681A0B'
  },
  craftProfitHeader: {
    width: rowWidth,
    flexDirection: 'row',
    justifyContent:'space-between',
    marginBottom: 5,
    alignItems: 'center'
  },
  craftProfitCellHeaderCity: {
    textAlign: 'left',
    width: cellWidth,
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '700',
    fontFamily: 'Helvetica'
  },
  craftProfitCellHeader: {
    textAlign: 'right',
    width: cellWidth,
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '700',
    fontFamily: 'Helvetica'
  },
  craftProfitItemPrices: {
    width: rowWidth,
    flexDirection: 'row',
    justifyContent:'space-between',
    marginVertical: 1,
    alignItems: 'center'
  },
  craftProfitBottomBorder: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1
  },
  craftProfitCellCity: {
    textAlign: 'left',
    width: cellWidth,
    fontFamily: 'Helvetica',
    fontSize: 11,
    fontWeight: '400'
  },
  craftProfitCell: {
    textAlign: 'right',
    width: priceCellWidth,
    fontFamily: 'Helvetica',
    fontSize: 11,
    fontWeight: '400'
  },
  craftProfitCellPrice: {
    fontWeight: 'bold'
  },
  craftProfitBigger: {
    color: 'red'
  },
  craftProfitLower: {
    color: 'green'
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  popUpContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  popUpContainerAboveKeyboard: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  innerContainer: {
    marginHorizontal: 20,
    backgroundColor: '#71564E',
    borderWidth: 1,
    borderColor: '#D5CECC',
    borderRadius: 8,
    alignSelf: 'stretch'
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  craftProfitTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  craftProfitHelpIcon: {
    position: 'absolute',
    top: -13
  },
  albionDataLink: {
    textDecorationLine: 'underline',
    color: '#BE8B06'
  },
  messagePopupButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginBottom: 15
  },
  messagePopupButtonOK: {
    width: buttonWidth
  },
  messagePopupButtonLabel: {
    fontSize: 15
  },
  craftItemsImages: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  craftItemsResourcePlaceholderImage: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute'
  },
  craftItemsImage: {
    width: 85,
    height: 85,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  craftItemsResourceCountLabel: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#681A0B'
  },
  craftItemsItemsNeededLabel: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
    color: '#681A0B',
    marginBottom: 5
  },
  craftItemsResourcesContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  requestErrorButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginBottom: 15
  },
  requestErrorButtonRefresh: {
    fontSize: 15
  },
  requestErrorLabel: {
    fontFamily: 'Helvetica',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#D5CECC',
    marginBottom: 15
  },
  requestLoadingView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  itemsNeededRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  cityCraftSectionButtonView: {
    backgroundColor: '#681A0B',
    borderRadius: 8,
    paddingRight: 10,
    paddingLeft: 25,
    borderColor: '#D5CECC',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    height: 40
  },
  cityCraftSectionButtonViewActive: {
    backgroundColor: '#D5CECC',
    borderRadius: 8,
    paddingRight: 10,
    paddingLeft: 25,
    borderColor: '#681A0B',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    height: 40
  },
  cityCraftSectionButtonTitle: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: '#D5CECC'
  },
  cityCraftSectionButtonContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
