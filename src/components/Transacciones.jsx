import React, { use, useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { guardarTransacciones } from '../features/transacciones.slice';
import { useSelector } from 'react-redux';
import api from '../data/api';
import Transaccion from './Transaccion';

const Transacciones = () => {
    const transacciones = useSelector(state => state.transacciones.lista);

    return (
        <div>
            <h2>Transacciones</h2>
            <ul>
                {transacciones.map(transaccion => (
                    <Transaccion key={transaccion._id} transaccion={transaccion} />
                ))}
            </ul>
        </div>
    )
}

export default Transacciones