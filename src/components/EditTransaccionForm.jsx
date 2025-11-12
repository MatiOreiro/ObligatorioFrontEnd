import React from 'react'
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { editTransaccionSchema } from '../validators/transacciones.validators';
import { useTranslation } from 'react-i18next'

const EditTransaccionForm = ({ initialValues = {}, onEdit } = {}) => {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(editTransaccionSchema),
        defaultValues: {
            tipo: initialValues.tipo || 'ingreso',
            monto: initialValues.monto ?? '',
            categoria: initialValues?.categoria?.nombre || initialValues?.categoria || '',
            descripcion: initialValues.descripcion || ''
        }
    });

    const submit = (data) => {
        if (typeof onEdit === 'function') {
            onEdit(data);
            return;
        }

        // If no handler provided, fallback to console (older behavior was to post directly)
        console.warn('EditTransaccionForm submitted but no onEdit handler provided', data);
    }

    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className="field">
                <label>{t('transactions.type')}</label>
                <select {...register('tipo')}>
                    <option value="ingreso">{t('income')}</option>
                    <option value="egreso">{t('outcome')}</option>
                </select>
                {errors.tipo && <div className="error" role="alert">{errors.tipo.message}</div>}
            </div>

            <div className="field">
                <label>{t('transactions.amount')}</label>
                <input type="number" step="0.01" {...register('monto')} />
                {errors.monto && <div className="error" role="alert">{errors.monto.message}</div>}
            </div>

            <div className="field">
                <label>{t('transactions.category')}</label>
                <input type="text" {...register('categoria')} placeholder="Alimentos, Hogar" />
                {errors.categoria && <div className="error" role="alert">{errors.categoria.message}</div>}
            </div>

            <div className="field">
                <label>{t('transactions.description')}</label>
                <textarea rows={3} {...register('descripcion')}></textarea>
                {errors.descripcion && <div className="error" role="alert">{errors.descripcion.message}</div>}
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary">{t('buttons.save')}</button>
            </div>
        </form>
    )
}

export default EditTransaccionForm
