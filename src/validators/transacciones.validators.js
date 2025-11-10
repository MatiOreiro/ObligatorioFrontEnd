import Joi from "joi"

export const createTransaccionSchema = Joi.object({
    tipo: Joi.string().valid('ingreso', 'egreso').required().messages({
        "any.only": "El tipo de transacción debe ser 'ingreso' o 'egreso'",
    }),
    monto: Joi.number().min(0).required().messages({
        "number.min": "El monto debe ser un número positivo",
    }),
    categoria: Joi.string().required().messages({
        "any.required": "La categoría es obligatoria",
    }),
    descripcion: Joi.string().max(500).messages({
        "string.max": "La descripción no puede exceder los 500 caracteres",
    }),
    cuenta: Joi.string().required().messages({
        "any.required": "La cuenta es obligatoria",
    }),
});