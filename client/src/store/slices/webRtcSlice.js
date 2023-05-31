import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import io from 'socket.io-client';

const sliceName = 'webRtcSlice';

const socket = io('http://localhost:8000'); // Replace with your server URL

export const connectToServer = createAsyncThunk(
    `${sliceName}/connectToServer`,
    (payload) => {
        const { data } = payload;
        socket.emit('room:join', data);
        return new Promise((resolve, reject) => {
            // Listen for the server response event
            socket.off('room:join');
            socket.on('room:join', (response) => {
                if (response.error) {
                    reject(response)
                }
                else {
                    resolve(response)
                }
            })
        })
    }
);

export const joinRoom = createAsyncThunk(
    `${sliceName}/joinRoom`,
    (payload) => {
        socket.emit('user:joined', payload);
        return new Promise((resolve, reject) => {
            // Listen for the server response event
            socket.off('user:joined');
            socket.on('user:joined', (response) => {
                if (response.error) {
                    reject(response)
                }
                else {
                    resolve(response)
                }
            })
        })
    }
);
export const callUser = createAsyncThunk(
    `${sliceName}/callUser`,
    (payload) => {
        socket.emit('user:call', payload);
        return new Promise((resolve, reject) => {
            // Listen for the server response event
            socket.off('user:call');
            socket.on('user:call', (response) => {
                if (response.error) {
                    reject(response)
                }
                else {
                    resolve(response)
                }
            })
        })
    }
);



const initialState = {
    pageDataLoading: false,
    pageData: [],
    peerConnection: null,
    connectToServerLoading: false,
    loginDetails: {},
    joinRoomLoading:false,


};

const webRtcSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(connectToServer.pending, (state) => {
            state.connectToServerLoading = true;
        });
        builder.addCase(connectToServer.fulfilled, (state, action) => {
            state.loginDetails = action.payload;
            state.connectToServerLoading = false;
        });
        builder.addCase(connectToServer.rejected, (state) => {
            state.connectToServerLoading = false;
        });
        builder.addCase(joinRoom.pending, (state) => {
            state.joinRoomLoading = true;
            state.peerConnection = null;
        });
        builder.addCase(joinRoom.fulfilled, (state, action) => {
            // state.loginDetails = action.payload;
            state.joinRoomLoading = false;
        });
        builder.addCase(joinRoom.rejected, (state) => {
            state.joinRoomLoading = false;
        });
    },
});

const webRtcReducers = webRtcSlice.reducer;
export default webRtcReducers;