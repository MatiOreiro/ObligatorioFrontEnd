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

    const dispatch = useDispatch();

    const onSubmit = (data) => {
        handleEdit(data);
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