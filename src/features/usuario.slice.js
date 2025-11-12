import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cuentas: [],
    imagenPerfil: 'https://res.cloudinary.com/douqrno9i/image/upload/v1762174755/samples/man-portrait.jpg',
    saldoCuenta1: 0,
    saldoCuenta2: 0,
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
    },
    guardarImagenPerfil: (state, action) => {
      state.imagenPerfil = action.payload;
    },
    limpiarImagenPerfil: (state) => {
      state.imagenPerfil = 'https://res.cloudinary.com/douqrno9i/image/upload/v1762174755/samples/man-portrait.jpg';
    },
    guardarSaldo1: (state, action) => {
      state.saldoCuenta1 = action.payload;
    },
    guardarSaldo2: (state, action) => {
      state.saldoCuenta2 = action.payload;
    },
    restarSaldo1: (state, action) => {
      state.saldoCuenta1 -= action.payload;
    },
    sumarSaldo1: (state, action) => {
      state.saldoCuenta1 += action.payload;
    },
    restarSaldo2: (state, action) => {
      state.saldoCuenta2 -= action.payload;
    },
    sumarSaldo2: (state, action) => {
      state.saldoCuenta2 += action.payload;
    },
  },
});

export const { guardarCuentas, limpiarCuentas, guardarImagenPerfil, limpiarImagenPerfil, guardarSaldo1, guardarSaldo2, restarSaldo1, sumarSaldo1, restarSaldo2, sumarSaldo2 } = usuarioSlice.actions;
export default usuarioSlice.reducer;