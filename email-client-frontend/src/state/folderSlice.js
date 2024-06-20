import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFolders } from '../utils/api';

export const loadFolders = createAsyncThunk('folders/loadFolders', async (email) => {
    const response = await fetchFolders(email);
    return response;
});

const folderSlice = createSlice({
    name: 'folders',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadFolders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadFolders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(loadFolders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default folderSlice.reducer;
