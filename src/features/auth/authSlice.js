import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

const initialState = {
    access: localStorage.getItem('access') || null,
    refresh: localStorage.getItem('refresh') || null,
    user: null,
    loading: false,
    error: null,
    loadingUser: false,
    initialized: false // NEW
};


export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password }, thunkAPI) => {
        try {
            const res = await axios.post('/token/', { username, password });
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, thunkAPI) => {
        try {
            console.log('🔍 Fetching user...');
            const res = await axios.get('/user/info/');
            console.log('✅ Got user:', res.data);
            return res.data;
        } catch (error) {
            console.error('❌ Fetch user failed:', error.response?.data);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.access = null;
            state.refresh = null;
            localStorage.clear();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.initialized = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.access = action.payload.access;
                state.refresh = action.payload.refresh;
                state.initialized = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.detail || 'Login failed';
                state.initialized = true;
            })

            // ✅ Only ONE pending handler
            .addCase(fetchUser.pending, (state) => {
                state.loadingUser = true;
                state.initialized = false;
            })

            // ✅ Only ONE fulfilled handler
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loadingUser = false;
                state.initialized = true;
            })

            // ✅ Only ONE rejected handler
            .addCase(fetchUser.rejected, (state) => {
                state.user = null;
                state.loadingUser = false;
                state.initialized = true;
            });
    }
    ,
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
