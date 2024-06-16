import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEmails } from '../utils/api';

export const loadEmails = createAsyncThunk('emails/loadEmails', async (email) => {
    const response = await fetchEmails(email);
    return response;
});

const emailSlice = createSlice({
    name: 'emails',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadEmails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadEmails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(loadEmails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default emailSlice.reducer;
