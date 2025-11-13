import React from 'react'
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { editTransaccionSchema } from '../validators/transacciones.validators';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

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
                <label htmlFor="tipo">{t('transactions.type')}</label>
                <select id="tipo" defaultValue={tipo} {...register("tipo")}>
                    <option value="ingreso">{t('income')}</option>
                    <option value="egreso">{t('outcome')}</option>
                </select>
                {errors.tipo && <div className="error" role="alert">{errors.tipo.message}</div>}
            </div>

            <div className="field">
                <label htmlFor="monto">{t('transactions.amount')}</label>
                <input type="number" id="monto" defaultValue={monto} step="0.01" {...register("monto")} />
                {errors.monto && <div className="error" role="alert">{errors.monto.message}</div>}
            </div>

            <div className="field">
                <label htmlFor="categoria">{t('transactions.category')}</label>
                <input type="text" id="categoria" defaultValue={categoria} placeholder="Alimentos, Hogar" {...register("categoria")} />
                {errors.categoria && <div className="error" role="alert">{errors.categoria.message}</div>}
            </div>

            <div className="field">
                <label htmlFor="descripcion">{t('transactions.description')}</label>
                <textarea id="descripcion" rows={3} defaultValue={descripcion} {...register("descripcion")}></textarea>
                {errors.descripcion && <div className="error" role="alert">{errors.descripcion.message}</div>}
            </div>

            <button type="submit">{t('buttons.edit')}</button>
        </form>
    )
}

export default TransaccionEditForm