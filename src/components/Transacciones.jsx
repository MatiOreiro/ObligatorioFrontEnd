import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { eliminarTransaccion } from "../features/transacciones.slice";
import { useSelector } from "react-redux";
import api from "../data/api";
import Transaccion from "./Transaccion";
import TransaccionModal from "./TransaccionModal";
import TransaccionEditModal from "./TransaccionEditModal";
import ConfirmDialog from "./ConfirmDialog";
import { useTranslation } from "react-i18next";
import {
  sumarSaldo1,
  restarSaldo1,
  sumarSaldo2,
  restarSaldo2,
} from "../features/usuario.slice";
import { ToastContainer, toast } from "react-toastify";

const Transacciones = () => {
  const transacciones = useSelector((state) => state.transacciones.lista);
  const cuentas = useSelector((state) => state.usuario.cuentas);

  const [selected, setSelected] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleDetails = (t) => {
    setSelected(t);
  };

  const handleClose = () => setSelected(null);

  // Placeholder edit/delete handlers — adapt to your app's logic
  const handleEdit = (t) => setEditItem(t);

  const [confirmDeleteItem, setConfirmDeleteItem] = useState(null);

  const handleDelete = (t) => setConfirmDeleteItem(t);

  const doDelete = (transaccion) => {
    api
      .delete(`/transaccion/eliminar/${transaccion._id}`)
      .then((response) => {
        dispatch(eliminarTransaccion(transaccion._id));
        console.log(transaccion);
        toast.success(t("toasts.deleteSuccess"));

        if (transaccion.cuentaId === cuentas[0]._id) {
          if (transaccion.tipo === "ingreso") {
            dispatch(restarSaldo1(Number(transaccion.monto)));
          } else {
            dispatch(sumarSaldo1(Number(transaccion.monto)));
          }
        } else if (t.cuentaId === cuentas[1]._id) {
          if (t.tipo === "ingreso") {
            dispatch(restarSaldo2(Number(transaccion.monto)));
          } else {
            dispatch(sumarSaldo2(Number(transaccion.monto)));
          }
        }
      })
      .catch((err) => {
        console.error("Error al eliminar", err);
        toast.error(t("toasts.deleteError"));
      })
      .finally(() => setConfirmDeleteItem(null));
  };

  return (
    <div>
      <h2>{t("transactions.title")}</h2>
      <ul>
        {transacciones.map((transaccion) => (
          <li key={transaccion._id}>
            <Transaccion
              transaccion={transaccion}
              onDetails={handleDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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
