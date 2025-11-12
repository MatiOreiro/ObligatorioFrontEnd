import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const Saldo = ({ saldo, titulo, subtitulo }) => {
    return (
        <div>
            <h3>{titulo}</h3>
            <p>${saldo}</p>
        </div>
    )
}

export default Saldo