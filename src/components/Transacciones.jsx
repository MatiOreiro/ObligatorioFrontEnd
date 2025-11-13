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
import { sumarSaldo1, restarSaldo1, sumarSaldo2, restarSaldo2 } from '../features/usuario.slice';
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";

const Transacciones = () => {
  const transacciones = useSelector(state => state.transacciones.lista);
  const cuentas = useSelector(state => state.usuario.cuentas);
  const [filteredTransacciones, setFilteredTransacciones] = useState([...transacciones].reverse());

  const [selected, setSelected] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { register, handleSubmit, reset } = useForm();

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
    // Implement filtering logic here based on data.cuenta, data.tipo, data.categoria, data.fechaDesde, data.fechaHasta
    setFilteredTransacciones([...transacciones].reverse().filter(tran => {
      let match = true;
      if (data.cuenta && data.cuenta !== 'all') {
        match = match && (tran.cuentaId === data.cuenta);
      }
      if (data.tipo && data.tipo !== 'all') {
        match = match && (tran.tipo === data.tipo);
      }
      if (data.categoria && data.categoria.trim() !== '') {
        match = match && (tran.categoria.nombre.toLowerCase().includes(data.categoria.trim().toLowerCase()));
      }
      if (data.fechaDesde) {
        match = match && (new Date(tran.fecha) >= new Date(data.fechaDesde));
      }
      if (data.fechaHasta) {
        match = match && (new Date(tran.fecha) <= new Date(data.fechaHasta));
      }
      if (data.periodo && data.periodo !== 'all') {
        const now = new Date();
        let compareDate = new Date();
        if (data.periodo === 'lastWeek') {
          compareDate.setDate(now.getDate() - 7);
        } else if (data.periodo === 'lastMonth') {
          compareDate.setMonth(now.getMonth() - 1);
        } else if (data.periodo === 'lastYear') {
          compareDate.setFullYear(now.getFullYear() - 1);
        }
        match = match && (new Date(tran.fecha) >= compareDate);
      }
      return match;
    }));
  };

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

  const limpiarFiltros = () => {
    setFilteredTransacciones([...transacciones].reverse());
    // no resetea los selects visualmente, pero resetea el filtrado
    // para resetear visualmente habría que usar reset() de react-hook-form
    // de esta forma
    reset({
      cuenta: "all",
      tipo: "all",
      categoria: "",
      fechaDesde: "",
      fechaHasta: "",
      periodo: "all"
    });
  }

  return (
    <div>
      <form className="transacciones-filter-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label htmlFor="cuenta">{t('transactions.filterByAccount')}</label>
          <select id="cuenta" {...register("cuenta")}>
            <option value="all">{t('transactions.allAccounts')}</option>
            {cuentas.map(c => (
              <option key={c._id} value={c._id}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="tipo">{t('transactions.filterByType')}</label>
          <select id="tipo" {...register("tipo")}>
            <option value="all">{t('transactions.allTypes')}</option>
            <option value="ingreso">{t('income')}</option>
            <option value="egreso">{t('outcome')}</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="categoria">{t('transactions.filterByCategory')}</label>
          <input type="text" id="categoria" placeholder={t('transactions.categoryPlaceholder')} {...register("categoria")} />
        </div>
        <div className="field">
          <label htmlFor="fechaDesde">{t('transactions.filterByDateFrom')}</label>
          <input type="date" id="fechaDesde" {...register("fechaDesde")} />
        </div>
        <div className="field">
          <label htmlFor="fechaHasta">{t('transactions.filterByDateTo')}</label>
          <input type="date" id="fechaHasta" {...register("fechaHasta")} />
        </div>
        <div className='field'>
          <label htmlFor="periodo">{t('transactions.filterByPeriod')}</label>
          <select id="periodo" {...register("periodo")}>
            <option value="all">{t('transactions.allPeriods')}</option>
            <option value="lastWeek">{t('transactions.lastWeek')}</option>
            <option value="lastMonth">{t('transactions.lastMonth')}</option>
            <option value="lastYear">{t('transactions.lastYear')}</option>
          </select>
        </div>
        <button type="button" onClick={limpiarFiltros}>{t('transactions.clearFilters')}</button>
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
          _id={editItem._id}
          tipo={editItem.tipo}
          monto={editItem.monto}
          categoria={editItem.categoria.nombre}
          descripcion={editItem.descripcion}
          handleEdit={setEditItem}
          open={true}
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
