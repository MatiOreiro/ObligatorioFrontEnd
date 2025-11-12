import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { eliminarTransaccion } from '../features/transacciones.slice';
import { useSelector } from 'react-redux';
import api from '../data/api';
import Transaccion from './Transaccion';
import TransaccionModal from './TransaccionModal';
import TransaccionEditModal from './TransaccionEditModal';
import ConfirmDialog from './ConfirmDialog';
import { useTranslation } from 'react-i18next';
import TransaccionEditForm from './TransaccionEditForm';
import { sumarSaldo1, restarSaldo1, sumarSaldo2, restarSaldo2 } from '../features/usuario.slice';
import { set, useForm } from 'react-hook-form';
import { ToastContainer, toast } from "react-toastify";

const Transacciones = () => {
    const transacciones = useSelector(state => state.transacciones.lista);
    const cuentas = useSelector(state => state.usuario.cuentas);
    const [filteredTransacciones, setFilteredTransacciones] = useState([...transacciones].reverse());

    const [selected, setSelected] = useState(null)
    const [editItem, setEditItem] = useState(null)
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { register, handleSubmit } = useForm();

  const handleDetails = (t) => {
    setSelected(t);
  };

  const handleClose = () => setSelected(null);

    // Placeholder edit/delete handlers — adapt to your app's logic
    const handleEdit = (t) => setEditItem(t)

    const [confirmDeleteItem, setConfirmDeleteItem] = useState(null)

    const handleDelete = (t) => setConfirmDeleteItem(t)

    const onSubmit = (data) => {
        console.log('Filter data:', data);
        // Implement filtering logic here based on data.cuenta, data.tipo, data.categoria
        setFilteredTransacciones(transacciones.filter(t => {
            return (data.cuenta === 'all' || t.cuentaId === data.cuenta) &&
                   (data.tipo === 'all' || t.tipo === data.tipo) &&
                   (data.categoria === '' || t.categoria.nombre.toLowerCase().includes(data.categoria.toLowerCase()));
        }));
    }

    const doDelete = (t) => {
        api.delete(`/transaccion/eliminar/${t._id}`)
            .then(response => {
                dispatch(eliminarTransaccion(t._id));
                console.log(t);

                if (t.cuentaId === cuentas[0]._id) {
                    if (t.tipo === 'ingreso') {
                        dispatch(restarSaldo1(Number(t.monto)));
                    } else {
                        dispatch(sumarSaldo1(Number(t.monto)));
                    }
                } else if (t.cuentaId === cuentas[1]._id) {
                    if (t.tipo === 'ingreso') {
                        dispatch(restarSaldo2(Number(t.monto)));
                    } else {
                        dispatch(sumarSaldo2(Number(t.monto)));
                    }
                }
                toast.success(t("toasts.deleteSuccess"));
            })
            .catch(err => {
        console.error("Error al eliminar", err);
        toast.error(t("toasts.deleteError"));
      })
            .finally(() => setConfirmDeleteItem(null))
    }

    return (
        <div>
            <form className="transacciones-filter-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="field">
                    <label>{t('transactions.filterByAccount')}</label>
                    <select {...register("cuenta")}>
                        <option value="all">{t('transactions.allAccounts')}</option>
                        {cuentas.map(c => (
                            <option key={c._id} value={c._id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="field">
                    <label>{t('transactions.filterByType')}</label>
                    <select {...register("tipo")}>
                        <option value="all">{t('transactions.allTypes')}</option>
                        <option value="ingreso">{t('income')}</option>
                        <option value="egreso">{t('outcome')}</option>
                    </select>
                </div>
                <div className="field">
                    <label>{t('transactions.filterByCategory')}</label>
                    <input type="text" placeholder={t('transactions.categoryPlaceholder')} {...register("categoria")} />
                </div>
                <button type="submit">{t('buttons.applyFilters')}</button>
            </form>
            <h2>{t('transactions.title')}</h2>
            <ul>
                {filteredTransacciones.map(transaccion => (
                    <li key={transaccion._id}>
                        <Transaccion transaccion={transaccion} onDetails={handleDetails} onEdit={handleEdit} onDelete={handleDelete} />
                    </li>
                ))}
            </ul>

      {selected && (
        <TransaccionModal
          transaccion={selected}
          onClose={handleClose}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {editItem && (
        <TransaccionEditModal
          transaccion={editItem}
          onClose={() => setEditItem(null)}
        />
      )}

      {confirmDeleteItem && (
        <ConfirmDialog
          title={t("buttons.deleteTransaction")}
          message={t("confirmations.deleteTransaction", {
            monto: confirmDeleteItem.monto,
          })}
          confirmLabel={t("buttons.delete")}
          cancelLabel={t("buttons.cancel")}
          onConfirm={() => doDelete(confirmDeleteItem)}
          onCancel={() => setConfirmDeleteItem(null)}
        />
      )}
    </div>
  );
};

export default Transacciones;
