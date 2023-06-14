import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
const sliceName = 'video';

export const getVideo = createAsyncThunk(
    `${sliceName}/getVideo`,
    async () => {
      try {
        const response = await fetch('http://192.168.1.91:8000/new');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching video:', error);
        throw error;
      }
    }
  );
  



const initialState = {
    pageDataLoading: false,
    pageData: [],
    videoLoading: false,
    videoDetails: ''


};

const videoSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getVideo.pending, (state) => {
            state.videoLoading = true;
        });
        builder.addCase(getVideo.fulfilled, (state, action) => {
            state.videoDetails = action.payload.filePath;
            state.videoLoading = false;
        });
        builder.addCase(getVideo.rejected, (state) => {
            state.videoLoading = false;
        });
    },
});

const videoReducers = videoSlice.reducer;
export default videoReducers;