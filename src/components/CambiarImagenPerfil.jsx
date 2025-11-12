import { useState } from "react";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import api from "../data/api";
import { useDispatch } from "react-redux";
import { guardarImagenPerfil } from "../features/usuario.slice";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from 'react-i18next';

const schema = Joi.object({
  image: Joi.any()
    .required()
    .custom((value, helpers) => {
      if (!value || value.length === 0) {
        return helpers.error("any.required");
      }
      const file = value[0];
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return helpers.error("any.invalid");
      }
      if (file.size > 2 * 1024 * 1024) {
        // Máx 2 MB
        return helpers.error("any.max");
      }
      return value;
    })
    .messages({
      "any.required": "La imagen es obligatoria",
      "any.invalid": "Solo se permiten JPG, PNG o WEBP",
      "any.max": "La imagen no puede superar los 2MB",
    }),
});

const CambiarImagenPerfil = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setUrl("");

    const file = data.image[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fullstack-preset"); // preset unsigned
    formData.append("cloud_name", "douqrno9i"); // cloud name

    //Cloud name en la URL
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/douqrno9i/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const uploaded = await res.json();
      setUrl(uploaded.secure_url);
      guardarImagen(uploaded.secure_url);
      toast.success(t("toasts.uploadSuccess"));
      reset();
    } catch (err) {
      console.error("Error al subir imagen:", err);
      toast.error(t("toasts.uploadError"));
    } finally {
      setLoading(false);
    }
  };

  const guardarImagen = (url) => {
    console.log(url);

    api
      .put("/usuario/actualizar-imagen/", { url })
      .then((response) => {
        console.log("Imagen de perfil actualizada", response.data);
        dispatch(guardarImagenPerfil(url));
      })
      .catch((error) => {
        console.error("Error al actualizar imagen de perfil", error);
      });
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>{t('image.changeImage')}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="file" {...register("image")} />
        {errors.image && <p style={{ color: "red" }}>{errors.image.message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? t('buttons.uploading') : t('buttons.uploadImage')}
        </button>
      </form>

      {url && (
        <div style={{ marginTop: 20 }}>
          <h4>{t('image.uploadedImage')}:</h4>
          <img
            src={url.replace(
              "/upload/",
              "/upload/c_scale,w_300/f_auto/q_auto/"
            )}
            alt="upload"
            width="100"
            style={{ borderRadius: "50%" }}
          />
          <p>
            {t('image.url')}:{" "}
            <a href={url} target="_blank" rel="noopener noreferrer">
              {t('image.viewImage')}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default CambiarImagenPerfil;
