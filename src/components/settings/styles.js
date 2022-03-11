import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C190B'
  },
  settingItemsContainer: {
    paddingTop: 10
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(196, 196, 196, 0.35)',
    marginTop: 1,
    padding: 12,
    alignItems: 'center'
  },
  settingItemImage: {
    tintColor: 'rgba(196, 196, 196, 0.35)'
  },
  settingItemText: {
    color: '#D5CECC',
    fontWeight: '700',
    fontFamily: 'Helvetica',
    fontSize: 20,
    marginVertical: 7,
    alignSelf : 'center',
    textAlign: 'center',
    marginBottom: 8
  },
  settingSaveButtonText: {
    color: '#D5CECC',
    fontWeight: '700',
    fontFamily: 'Helvetica',
    fontSize: 15,
    alignSelf : 'center',
    textAlign: 'center'
  },
  versionLabel: {
    color: '#D5CECC',
    fontFamily: 'Helvetica',
    fontSize: 16,
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  fmButton: {
    backgroundColor: '#681A0B',
    borderRadius: 8
  },
  aboutUsHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  aboutUsDataContainer: {
    padding: 12
  },
  aboutUsDataText: {
    color: '#D5CECC',
    lineHeight: 25,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    fontSize: 18,
    marginVertical: 7,
    alignSelf : 'center',
    textAlign: 'center',
    marginBottom: 20
  },
  link: {
    textDecorationLine: 'underline',
    color: '#BE8B06',
    fontSize: 18
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  selectedText: {
    color: '#BE8B06',
    fontSize: 18
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerContainer: {
    paddingRight: 20
  }
});
