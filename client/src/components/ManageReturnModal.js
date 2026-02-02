import React, { useState } from "react";
import "./ManageReturnModal.css";

const ManageReturnModal = ({ item, onClose, onSave }) => {
  const [newStatus, setNewStatus] = useState(item.Status);
  const [refundDeposit, setRefundDeposit] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminId = localStorage.getItem('userId');

    try {
      const response = await fetch(`http://localhost:8080/api/rental-item/${item.RentalItemId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: newStatus,
          refundDeposit: refundDeposit,
          aId: adminId
        })
      });

      if (!response.ok) {
        throw new Error("Eroare la actualizarea statusului.");
      }
      onSave(); 
      onClose();
    } catch (err) {
      console.error("Eroare actualizare:", err);
      alert("Nu s-a putut actualiza statusul.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Gestionează returul</h3>
        <p><strong>{item.ProductSize.Product.ProductName} - Comanda #{item.RentalId}</strong></p>

        <form onSubmit={handleSubmit}>
          <label>Status nou:</label>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="confirmata">Confirmată</option>
            <option value="plasata">Plasată</option>
            <option value="la-client">La client</option>
            <option value="returnata">Returnată</option>
            <option value="incheiata">Încheiată</option>
          </select>

          {newStatus !== "confirmata" && newStatus !== "plasata" && newStatus !== "la-client" && newStatus !== "returnata" && (
            <label>
                <input
                type="checkbox"
                checked={refundDeposit}
                onChange={() => setRefundDeposit(!refundDeposit)}
                />
                Returnează garanția
            </label>
            )}

          <div className="modal-buttons">
            <button type="submit">Salvează</button>
            <button type="button" onClick={onClose}>Anulează</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageReturnModal;
