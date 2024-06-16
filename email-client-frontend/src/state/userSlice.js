import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUser } from '../utils/api';

export const loadUser = createAsyncThunk('user/loadUser', async (email) => {
    const response = await fetchUser(email);
    return response;
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        details: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.details = action.payload;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default userSlice.reducer;
