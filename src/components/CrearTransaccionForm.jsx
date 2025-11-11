import React from 'react'
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { createTransaccionSchema } from '../validators/transacciones.validators';
import api from '../data/api';
import { useDispatch, useSelector } from 'react-redux';
import { agregarTransaccion } from '../features/transacciones.slice';

const CrearTransaccionForm = ({ onCreate } = {}) => {
    const cuentas = useSelector(state => state.usuario.cuentas);

    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(createTransaccionSchema)
    });

    const localSubmit = (data) => {
        // If a parent provided an onCreate handler, pass validated data to it
        if (typeof onCreate === 'function') {
            onCreate(data);
            return;
        }

        // Otherwise behave as before and call the API directly
        const payload = { tipo: data.tipo, monto: data.monto, descripcion: data.descripcion, categoria: data.categoria, cuenta: data.cuenta };
        const transaccion = { tipo: data.tipo, monto: data.monto, descripcion: data.descripcion, categoria: { nombre: data.categoria }, cuenta: data.cuenta, fecha: new Date().toISOString() };
        api.post('/transaccion/crear', payload).then(response => {
            dispatch(agregarTransaccion(transaccion));
            console.log(payload);
        }).catch(error => {
            console.error('Error al crear transacción', error);
        }).finally(() => {
            // loading
        });
    }

    return (
        <form onSubmit={handleSubmit(localSubmit)}>
            <div className='field'>
                <label>Cuenta</label>
                <select {...register("cuenta")}>
                    {cuentas.map(c => (
                        <option key={c._id} value={c._id}>{c.nombre}</option>
                    ))}
                </select>
                {errors.cuenta && <div className="error" role="alert">{errors.cuenta.message}</div>}
            </div>

            <div className="field">
                <label>Tipo</label>
                <select {...register("tipo")}>
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                </select>
                {errors.tipo && <div className="error" role="alert">{errors.tipo.message}</div>}
            </div>

            <div className="field">
                <label>Monto</label>
                <input type="number" step="0.01" {...register("monto")} />
                {errors.monto && <div className="error" role="alert">{errors.monto.message}</div>}
            </div>

            <div className="field">
                <label>Categoría</label>
                <input type="text" placeholder="Alimentos, Hogar" {...register("categoria")} />
                {errors.categoria && <div className="error" role="alert">{errors.categoria.message}</div>}
            </div>

            <div className="field">
                <label>Descripción</label>
                <textarea rows={3} {...register("descripcion")}></textarea>
                {errors.descripcion && <div className="error" role="alert">{errors.descripcion.message}</div>}
            </div>

            <button type="submit">Crear Transacción</button>
        </form>
    )
}

export default CrearTransaccionForm