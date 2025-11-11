import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cuentas: [],
    imagenPerfil: 'https://res.cloudinary.com/douqrno9i/image/upload/v1762174755/samples/man-portrait.jpg',
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
  },
});

export const { guardarCuentas, limpiarCuentas, guardarImagenPerfil, limpiarImagenPerfil } = usuarioSlice.actions;
export default usuarioSlice.reducer;