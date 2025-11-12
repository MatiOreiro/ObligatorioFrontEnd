import React from 'react'
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { createTransaccionSchema } from '../validators/transacciones.validators';

const EditTransaccionForm = ({ initialValues = {}, onEdit } = {}) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(createTransaccionSchema),
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
                <label>Tipo</label>
                <select {...register('tipo')}>
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                </select>
                {errors.tipo && <div className="error" role="alert">{errors.tipo.message}</div>}
            </div>

            <div className="field">
                <label>Monto</label>
                <input type="number" step="0.01" {...register('monto')} />
                {errors.monto && <div className="error" role="alert">{errors.monto.message}</div>}
            </div>

            <div className="field">
                <label>Categoría</label>
                <input type="text" {...register('categoria')} placeholder="Alimentos, Hogar" />
                {errors.categoria && <div className="error" role="alert">{errors.categoria.message}</div>}
            </div>

            <div className="field">
                <label>Descripción</label>
                <textarea rows={3} {...register('descripcion')}></textarea>
                {errors.descripcion && <div className="error" role="alert">{errors.descripcion.message}</div>}
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary">Guardar</button>
            </div>
        </form>
    )
}

export default EditTransaccionForm
