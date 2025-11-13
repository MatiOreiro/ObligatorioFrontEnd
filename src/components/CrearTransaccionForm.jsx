import React, { useId } from 'react'
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { createTransaccionSchema } from '../validators/transacciones.validators';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const CrearTransaccionForm = ({ onCreate } = {}) => {
    const cuentas = useSelector(state => state.usuario.cuentas);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const id = useId();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(createTransaccionSchema)
    });

    const localSubmit = (data) => {
        // If a parent provided an onCreate handler, pass validated data to it
        if (typeof onCreate === 'function') {
            onCreate(data);
            return;
        }
    }

    return (
        <form onSubmit={handleSubmit(localSubmit)}>
            <div className='field'>
                <label htmlFor='cuenta'>{t('transactions.account')}</label>
                <select id="cuenta" {...register("cuenta")}>
                    {cuentas.map(c => (
                        <option key={c._id} value={c._id}>{c.nombre}</option>
                    ))}
                </select>
                {errors.cuenta && <div className="error" role="alert">{errors.cuenta.message}</div>}
            </div>

            <div className="field">
                <label htmlFor='tipo'>{t('transactions.type')}</label>
                <select id="tipo" {...register("tipo")}>
                    <option value="ingreso">{t('income')}</option>
                    <option value="egreso">{t('outcome')}</option>
                </select>
                {errors.tipo && <div className="error" role="alert">{errors.tipo.message}</div>}
            </div>

            <div className="field">
                <label htmlFor='monto'>{t('transactions.amount')}</label>
                <input type="number" step="0.01" id="monto" {...register("monto")} />
                {errors.monto && <div className="error" role="alert">{errors.monto.message}</div>}
            </div>

            <div className="field">
                <label htmlFor='categoria'>{t('transactions.category')}</label>
                <input type="text" id="categoria" placeholder="Alimentos, Hogar" {...register("categoria")} />
                {errors.categoria && <div className="error" role="alert">{errors.categoria.message}</div>}
            </div>

            <div className="field">
                <label htmlFor='descripcion'>{t('transactions.description')}</label>
                <textarea id="descripcion" rows={3} {...register("descripcion")}></textarea>
                {errors.descripcion && <div className="error" role="alert">{errors.descripcion.message}</div>}
            </div>

            <button type="submit">{t('buttons.createTransaction')}</button>
        </form>
    )
}

export default CrearTransaccionForm