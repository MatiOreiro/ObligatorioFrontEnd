import { createSlice } from '@reduxjs/toolkit';

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
            state.lista = state.lista.filter(transaccion => transaccion.id !== action.payload.id);
        },
    },
});

export const { agregarTransaccion, eliminarTransaccion, guardarTransacciones } = transaccionesSlice.actions;

export default transaccionesSlice.reducer;