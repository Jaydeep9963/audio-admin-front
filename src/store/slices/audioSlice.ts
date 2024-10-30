import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioState } from './type';
import { Audio } from 'src/models/audio_type';

const initialState: AudioState = {
  audios: null,
  totalAudios: 0,
  currentPage: 1,
  pageSize: 10,
  totalPages: 0
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    setAudioResponse: (
      state,
      action: PayloadAction<AudioState>
    ) => {
      state.audios = action.payload.audios;
      state.totalAudios = action.payload.totalAudios;
      state.currentPage = action.payload.currentPage;
      state.pageSize = action.payload.pageSize;
      state.totalPages = action.payload.totalPages;
    },
    setAudio: (state, action: PayloadAction<Audio>) => {
      const newAudios = [...state.audios, action.payload];
      state.audios = [...newAudios];
    },
    updateAudio: (state, action: PayloadAction<Audio>) => {
      const updatedAudio = action.payload;
      const findIndex = state.audios.findIndex(
        (audio) => audio._id == updatedAudio._id
      );

      state.audios.splice(findIndex, 1, updatedAudio);
    },
    deleteAudio: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const newCategories = state.audios.filter(
        (audio) => audio._id !== id
      );

      state.audios = [...newCategories];
    }
  }
});

export const {
  setAudioResponse,
  setAudio,
  updateAudio,
  deleteAudio
} = audioSlice.actions;
export default audioSlice.reducer;
