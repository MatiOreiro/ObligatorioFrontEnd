import Joi from "joi"

export const loginSchema = Joi.object({
    username: Joi.string().min(2).max(50).required().messages({
        "string.min": "El nombre de usuario debe tener al menos {#limit} caracteres",
        "string.max": "El nombre de usuario debe tener como máximo {#limit} caracteres",
        "string.empty": "El nombre de usuario es obligatorio."

    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "La contraseña debe tener al menos {#limit} caracteres",
        "string.empty": "La contraseña es obligatoria."
    })
});

export const registerSchema = Joi.object({
    username: Joi.string().min(2).max(50).required().messages({
        "string.min": "El nombre de usuario debe tener al menos {#limit} caracteres",
        "string.max": "El nombre de usuario debe tener como máximo {#limit} caracteres",
        "string.empty": "El nombre de usuario es obligatorio."
    }),
    email: Joi.string().email().required().messages({
        "string.email": "El correo electrónico no es válido",
        "string.empty": "El correo electrónico es obligatorio."
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "La contraseña debe tener al menos {#limit} caracteres",
        "string.empty": "La contraseña es obligatoria."
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        "any.only": "Las contraseñas no coinciden",
        "string.empty": "La confirmación de la contraseña es obligatoria."
    })
});