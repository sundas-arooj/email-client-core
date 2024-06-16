import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './emailSlice';
import userReducer from './userSlice';

const store = configureStore({
    reducer: {
        emails: emailReducer,
        user: userReducer,
    },
});

export default store;
