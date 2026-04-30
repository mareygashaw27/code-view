import React, { useEffect, useState } from "react";
import API from "../api";
import { formatDateEC } from "../utils/dateFormatter";

const t = {
  en: {
    title: "My Reservations",
    book: "Book",
    date: "Reserved On",
    action: "Action",
    cancel: "Cancel",
    confirmCancel: "Cancel this reservation?",
    noData: "No active reservations"
  },
  am: {
    title: "የያዝኳቸው መጻሕፍት",
    book: "መጽሐፍ",
    date: "የተያዘበት ቀን",
    action: "ተግባር",
    cancel: "ሰርዝ",
    confirmCancel: "ይህን ማስያዣ መሰረዝ ትፈልጋለህ?",
    noData: "ምንም የተያዘ መጽሐፍ የለም"
  }
};

export default function MyReservations({ lang }) {
  const [myReserves, setMyReserves] = useState([]);
  const [loading, setLoading] = useState(true);
  const T = t[lang];

  const loadData = () => {
    setLoading(true);
    API.get("/reservation/my")
      .then((r) => {
        setMyReserves(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const cancelReservation = async (id) => {
    if (!window.confirm(T.confirmCancel)) return;
    try {
      await API.delete(`/reservation/${id}`);
      loadData();
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", animation: "fadeIn 0.5s ease-out" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      <div className="card-premium" style={{ padding: "32px" }}>
        <h2 style={{ marginBottom: 32, color: "var(--text-main)", fontSize: 24, fontWeight: 800, display: "flex", alignItems: "center", gap: "12px", letterSpacing: "-0.025em" }}>
          <span style={{ fontSize: "28px" }}>⏳</span> {T.title}
        </h2>
        
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>#</th>
                <th>{T.book}</th>
                <th>{T.date}</th>
                <th style={{ textAlign: "right" }}>{T.action}</th>
              </tr>
            </thead>
            <tbody>
              {myReserves.map((r, i) => (
                <tr key={r._id} style={{ transition: "var(--transition)" }}>
                  <td style={{ fontWeight: 600, color: "var(--text-muted)" }}>{i + 1}</td>
                  <td style={{ fontWeight: 700, color: "var(--primary)" }}>{r.book_id?.title}</td>
                  <td style={{ fontWeight: 500 }}>{formatDateEC(r.reserve_date, lang)}</td>
                  <td style={{ textAlign: "right" }}>
                    <button 
                      onClick={() => cancelReservation(r._id)} 
                      className="btn-premium btn-secondary-premium"
                      style={{ color: "var(--danger)", borderColor: "rgba(239, 68, 68, 0.1)", background: "rgba(239, 68, 68, 0.05)", padding: "6px 16px", fontSize: "12px" }}
                    >
                      {T.cancel}
                    </button>
                  </td>
                </tr>
              ))}
              {myReserves.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: 80, color: "var(--text-muted)", fontSize: "16px", fontWeight: 500 }}>
                    <div style={{ fontSize: "40px", marginBottom: "16px", opacity: 0.5 }}>📂</div>
                    ምንም መረጃ አልተገኘም (No records found)
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: 40, color: "var(--text-muted)", fontWeight: 600 }}>Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
