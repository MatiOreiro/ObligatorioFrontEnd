import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: "",
};

const usuarioSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {
    guardarUsuario: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { guardarUsuario } = usuarioSlice.actions;

export default usuarioSlice.reducer;