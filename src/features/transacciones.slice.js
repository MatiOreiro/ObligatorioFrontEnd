import { createSlice } from '@reduxjs/toolkit';
import { act } from 'react';

const initialState = {
    lista: [],
};

const transaccionesSlice = createSlice({
    name: 'transacciones',
    initialState,
    reducers: {
        guardarTransacciones: (state, action) => {
            state.lista = action.payload;
        },
        agregarTransaccion: (state, action) => {
            state.lista.push(action.payload);
        },
        eliminarTransaccion: (state, action) => {
            state.lista = state.lista.filter(transaccion => transaccion._id !== action.payload);
        },
        limpiarTransacciones: (state) => {
            state.lista = [];
        },
        actualizarTransaccion: (state, action) => {
            const index = state.lista.findIndex(t => t._id === action.payload._id);
            if (index !== -1) {
                state.lista[index] = action.payload;
            }
        },
    },
});

export const { agregarTransaccion, eliminarTransaccion, guardarTransacciones, limpiarTransacciones, actualizarTransaccion } = transaccionesSlice.actions;
export default transaccionesSlice.reducer;