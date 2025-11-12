import React from 'react'
import { useSelector } from 'react-redux'

const ImagenPerfil = () => {
    const url = useSelector(state => state.usuario.imagenPerfil);
    const src = url ? url.replace('/upload/', '/upload/c_scale,w_300/f_auto/q_auto/') : '';
    return (
        <div className="imagen-perfil" role="img" aria-label="Imagen de perfil">
            <img className="imagen-perfil-img" src={src} alt="perfil" />
        </div>
    )
}

export default ImagenPerfil