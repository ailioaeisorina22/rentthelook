import React, { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import "./AdminDashboard.css";
import AdminReports from "./AdminReports";
import ManageReturnModal from "./ManageReturnModal";

const AdminDashboard = () => {
  const [allRentals, setAllRentals] = useState([]);
  const [statusFilter, setStatusFilter] = useState("toate");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReports, setShowReports] = useState(false);


const handleEditClick = (item) => {
  setSelectedItem(item);
  setShowModal(true);
};

const closeModal = () => {
  setSelectedItem(null);
  setShowModal(false);
};

const reloadData = () => {
  fetch("http://localhost:8080/api/rentals/all")
    .then(res => res.json())
    .then(data => setAllRentals(data))
    .catch(err => console.error("Eroare la preluare închirieri:", err));
};


  useEffect(() => {
    fetch("http://localhost:8080/api/rentals/all")
      .then((res) => res.json())
      .then((data) => setAllRentals(data))
      .catch((err) => console.error("Eroare la preluare închirieri:", err));
  }, []);

  const allItems = allRentals.flatMap((rental) =>
    rental.RentalItems.map((item) => ({
      ...item,
      RentalId: rental.RentalId,
      TotalPrice: rental.TotalPrice,
      UserId: rental.UserId
    }))
  );

  const filteredItems =
    statusFilter === "toate"
      ? allItems
      : allItems.filter((item) => item.Status === statusFilter);

    const renderStatus = (status) => {
        const cleaned = status?.toLowerCase().trim();
        switch (cleaned) {
          case "confirmata": return "✅ Confirmată";
          case "plasata": return "⌛ Plasată";
          case "incheiata": return "📅 Încheiată";
          case "returnata": return "📦 Returnată";
          case "la-client": return "🚚 La client";
          default: return status;
        }
    };
  return (
    <div className="admin-dashboard">
      <NavigationBar />
      <h2>Comenzi</h2>
            <button 
        className="toggle-report-btn" 
        onClick={() => setShowReports(!showReports)}
      >
        {showReports ? "Ascunde graficele 📉" : "Afișează graficele 📈"}
      </button>
      {showReports && 
      <>
      <h2>📊 Rapoarte închirieri 📊</h2>
      <AdminReports />
      </>}
      <div className="filter-bar-a">
        <label htmlFor="status-filter">Filtrează după status:</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="toate">Toate</option>
          <option value="confirmata">Confirmată</option>
          <option value="plasata">Plasată</option>
          <option value="la-client">La client</option>
          <option value="returnata">Returnată</option>
          <option value="incheiata">Încheiată</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>Nu există produse.</p>
      ) : (
        filteredItems.map((item, idx) => (
          <div key={idx} className="rental-item">
            <h4>Comandă #{item.RentalId} — User #{item.UserId} —Total: {item.TotalPrice} lei</h4>
            <p className="product-name">{item.ProductSize.Product.ProductName}</p>
            <p>
              Preț: {item.Price} lei | Garanție: {item.ProductSize.Product.Deposit} lei
            </p>
              <p>Data: {item.StartDate} - {item.EndDate}</p>
            <span className={`status-badge status-${item.Status}-a`}>
              {renderStatus(item.Status)}
            </span>
            {item.Status === "returnata" && (
              <button className="manage-return-btn" onClick={() => handleEditClick(item)}>
                Gestionează returul
              </button>
            )}
            {item.Status === "plasata" && (
              <button className="manage-return-btn" onClick={() => handleEditClick(item)}>
                Gestionează comanda
              </button>
            )}
            {item.Status === "confirmata" && (
              <button className="manage-return-btn" onClick={() => handleEditClick(item)}>
                Gestionează comanda
              </button>
            )}
            {item.Status === "la-client" && (
              <button className="manage-return-btn" onClick={() => handleEditClick(item)}>
                Gestionează comanda
              </button>
            )}

          </div>
        ))
      )}
      {showModal && selectedItem && (
        <ManageReturnModal
          item={selectedItem}
          onClose={closeModal}
          onSave={reloadData}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
