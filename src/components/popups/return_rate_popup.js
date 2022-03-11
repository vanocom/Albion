import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View } from 'react-native';
import { ReturnRatePicker } from '../common';
import { changeItemReturnRate as changeCraftReturnRate } from '../../slices/craft_list';
import { changeItemReturnRate as changeDetailsReturnRate } from '../../slices/details';
import { selectModal, closeModal  } from '../../slices/modal';
import { changeItemReturnRate } from '../../slices/search';
import { renderCloseButton } from '../common/popup';

// eslint-disable-next-line max-lines-per-function
const ReturnRatePopup = () => {
  const dispatch = useDispatch();
  const { data } = useSelector(selectModal);
  return (
    <View>
      {renderCloseButton()}
      <ReturnRatePicker
        selectedRate={ data.returnRate }
        key="city_craft_return_rate"
        select={ (rate) => {
          switch (data.typeFrom) {
            case 'details':
              dispatch(changeDetailsReturnRate({ uniqueName: data.uniqueName, returnRate: rate }));
              break;
            case 'search':
              dispatch(changeItemReturnRate({ uniqueName: data.uniqueName, returnRate: rate }));
              break;
            case 'craftList':
              dispatch(changeCraftReturnRate({ uniqueName: data.uniqueName, returnRate: rate }));
              break;
            default: break;
          }
          dispatch(closeModal());
        } }
        kind={ data.kind }
      />
    </View>

  );
};

export default ReturnRatePopup;
