import React from 'react'
import { useSelector } from 'react-redux'

const ImagenPerfil = () => {
    const url = useSelector(state => state.usuario.imagenPerfil);
    return (
        <div style={{ marginTop: 20 }}>
            <img
                src={url.replace('/upload/', '/upload/c_scale,w_300/f_auto/q_auto/')}
                alt="upload"
                width="50"
                height="50"
                style={{ borderRadius: "50%" }}
            />
        </div>
    )
}

export default ImagenPerfil