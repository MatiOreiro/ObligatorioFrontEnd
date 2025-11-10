import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cuentas: [],
};

const usuarioSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {
    guardarCuentas: (state, action) => {
      state.cuentas = action.payload;
    },
    limpiarCuentas: (state) => {
      state.cuentas = [];
    }
  },
});

export const { guardarCuentas, limpiarCuentas } = usuarioSlice.actions;
export default usuarioSlice.reducer;