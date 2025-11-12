import React from 'react'
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { editTransaccionSchema } from '../validators/transacciones.validators';
import api from '../data/api';
import { useDispatch, useSelector } from 'react-redux';
import { actualizarTransaccion } from '../features/transacciones.slice';
import { sumarSaldo1, restarSaldo1, sumarSaldo2, restarSaldo2 } from '../features/usuario.slice';

const TransaccionEditForm = ({ _id, tipo, monto, categoria, descripcion, handleEdit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(editTransaccionSchema)
    });

    const cuentas = useSelector(state => state.usuario.cuentas);

    const dispatch = useDispatch();

    const onSubmit = (data) => {
        api.put(`/transaccion/modificar/${_id}`, data).then(response => {
            console.log('Transacción editada', response.data);
            response.data.transaccion.categoria = { nombre: data.categoria };
            dispatch(actualizarTransaccion(response.data.transaccion));                  
            if (response.data.transaccion.cuentaId === cuentas[0]._id) {
                if (tipo === response.data.transaccion.tipo) {
                    if (tipo === 'ingreso') {
                        dispatch(restarSaldo1(Number(monto)));
                        dispatch(sumarSaldo1(Number(response.data.transaccion.monto)));
                    } else {
                        dispatch(sumarSaldo1(Number(monto)));
                        dispatch(restarSaldo1(Number(response.data.transaccion.monto)));
                    }
                } else {
                    if (response.data.transaccion.tipo === 'ingreso') {
                        dispatch(sumarSaldo1(Number(response.data.transaccion.monto)));
                        dispatch(sumarSaldo1(Number(monto)));
                    } else {
                        dispatch(restarSaldo1(Number(response.data.transaccion.monto)));
                        dispatch(restarSaldo1(Number(monto)));
                    }
                }
            } else if (response.data.transaccion.cuentaId === cuentas[1]._id) {
                if (tipo === response.data.transaccion.tipo) {
                    if (tipo === 'ingreso') {
                        dispatch(restarSaldo2(Number(monto)));
                        dispatch(sumarSaldo2(Number(response.data.transaccion.monto)));
                    } else {
                        dispatch(sumarSaldo2(Number(monto)));
                        dispatch(restarSaldo2(Number(response.data.transaccion.monto)));
                    }
                } else {
                    if (response.data.transaccion.tipo === 'ingreso') {
                        dispatch(sumarSaldo2(Number(response.data.transaccion.monto)));
                        dispatch(sumarSaldo2(Number(monto)));
                    } else {
                        dispatch(restarSaldo2(Number(response.data.transaccion.monto)));
                        dispatch(restarSaldo2(Number(monto)));
                    }
                }
            }
            handleEdit(null);
        }).catch(error => {
            console.error('Error al editar transacción', error);
        });
}

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
                <label>Tipo</label>
                <select defaultValue={tipo} {...register("tipo")}>
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                </select>
                {errors.tipo && <div className="error" role="alert">{errors.tipo.message}</div>}
            </div>

            <div className="field">
                <label>Monto</label>
                <input type="number" defaultValue={monto} step="0.01" {...register("monto")} />
                {errors.monto && <div className="error" role="alert">{errors.monto.message}</div>}
            </div>

            <div className="field">
                <label>Categoría</label>
                <input type="text" defaultValue={categoria} placeholder="Alimentos, Hogar" {...register("categoria")} />
                {errors.categoria && <div className="error" role="alert">{errors.categoria.message}</div>}
            </div>

            <div className="field">
                <label>Descripción</label>
                <textarea rows={3} defaultValue={descripcion} {...register("descripcion")}></textarea>
                {errors.descripcion && <div className="error" role="alert">{errors.descripcion.message}</div>}
            </div>

            <button type="submit">Editar Transacción</button>
        </form>
    )
}

export default TransaccionEditForm