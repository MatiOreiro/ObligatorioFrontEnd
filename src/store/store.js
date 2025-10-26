import { configureStore } from "@reduxjs/toolkit";
import transaccionesReducer from "../features/transacciones.slice";
import usuarioReducer from "../features/usuario.slice";

export const store = configureStore({
  reducer: {
    transacciones: transaccionesReducer,
    usuario: usuarioReducer,
  },
});