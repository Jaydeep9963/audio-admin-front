import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Artist } from 'src/models/artist_type';

export interface ArtistState {
  artists: Artist[] | null;
  totalArtists: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const initialState: ArtistState = {
  artists: null,
  totalArtists: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 0
};

export const artistSlice = createSlice({
  name: 'artist',
  initialState,
  reducers: {
    setArtistResponse: (state, action: PayloadAction<{
      artists: Artist[];
      totalArtists: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    }>) => {
      state.artists = action.payload.artists;
      state.totalArtists = action.payload.totalArtists;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.pageSize = action.payload.pageSize;
    },
    setArtist: (state, action: PayloadAction<Artist>) => {
      if (state.artists) {
        state.artists.push(action.payload);
      } else {
        state.artists = [action.payload];
      }
    },
    updateArtist: (state, action: PayloadAction<Artist>) => {
      if (state.artists) {
        const index = state.artists.findIndex(artist => artist._id === action.payload._id);
        if (index !== -1) {
          state.artists[index] = action.payload;
        }
      }
    },
    deleteArtist: (state, action: PayloadAction<string>) => {
      if (state.artists) {
        state.artists = state.artists.filter(artist => artist._id !== action.payload);
      }
    }
  }
});

export const { setArtistResponse, setArtist, updateArtist, deleteArtist } = artistSlice.actions;

export default artistSlice.reducer;