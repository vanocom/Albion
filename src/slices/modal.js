import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalId: null,
  showModal: false,
  data: null,
  message: ''
};

const modalSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    showModalWithID(state, action) {
      state.modalId = action.payload.modalId;
      state.data = action.payload.data;
      state.message = action.payload.message;
      if (state.modalId) state.showModal = true;
    },
    closeModal(state) {
      state.modalId = null;
      state.showModal = false;
    }
  }
});

export const {
  showModalWithID,
  closeModal
} = modalSlice.actions;

export const selectModal = (state) => state.modal;

export default modalSlice.reducer;
