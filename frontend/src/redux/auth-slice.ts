import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/network/axios-instances";
import axios, { isAxiosError } from "axios";
import { User } from "next-auth";

const initialState: {
  user: User | undefined | null;
  isLoading: boolean;
  error: boolean;
  isSuccess: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  message: string;
} = {
  user: null,
  isLoading: false,
  error: false,
  isSuccess: false,
  accessToken: null,
  refreshToken: null,
  message: "",
};

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, thunkAPI) => {
    try {
      const res = await api.post<User>("/login", {
        email: credentials.email,
        password: credentials.password,
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const message: string = error.response.data.message;
        return thunkAPI.rejectWithValue({ message });
      }
    }
  },
);

export const meProfile = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const res = await api.get<User>("/profile");
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const message: string = error.response.data.message;
      return thunkAPI.rejectWithValue(error);
    }
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await api.delete("/logout");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.message = action.payload as string;
      })
      .addCase(meProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(meProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(meProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
