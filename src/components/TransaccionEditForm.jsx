import React from 'react'
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { editTransaccionSchema } from '../validators/transacciones.validators';
import api from '../data/api';
import { useDispatch, useSelector } from 'react-redux';
import { actualizarTransaccion } from '../features/transacciones.slice';
import { sumarSaldo1, restarSaldo1, sumarSaldo2, restarSaldo2 } from '../features/usuario.slice';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from "react-toastify";

const TransaccionEditForm = ({ _id, tipo, monto, categoria, descripcion, handleEdit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(editTransaccionSchema)
    });

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const onSubmit = (data) => {
        handleEdit(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
                <label>{t('transactions.type')}</label>
                <select defaultValue={tipo} {...register("tipo")}>
                    <option value="ingreso">{t('income')}</option>
                    <option value="egreso">{t('outcome')}</option>
                </select>
                {errors.tipo && <div className="error" role="alert">{errors.tipo.message}</div>}
            </div>

            <div className="field">
                <label>{t('transactions.amount')}</label>
                <input type="number" defaultValue={monto} step="0.01" {...register("monto")} />
                {errors.monto && <div className="error" role="alert">{errors.monto.message}</div>}
            </div>

            <div className="field">
                <label>{t('transactions.category')}</label>
                <input type="text" defaultValue={categoria} placeholder="Alimentos, Hogar" {...register("categoria")} />
                {errors.categoria && <div className="error" role="alert">{errors.categoria.message}</div>}
            </div>

            <div className="field">
                <label>{t('transactions.description')}</label>
                <textarea rows={3} defaultValue={descripcion} {...register("descripcion")}></textarea>
                {errors.descripcion && <div className="error" role="alert">{errors.descripcion.message}</div>}
            </div>

            <button type="submit">{t('buttons.edit')}</button>
        </form>
    )
}

export default TransaccionEditForm