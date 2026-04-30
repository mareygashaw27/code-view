import React, { useEffect, useState } from "react";
import API from "../api";
import { formatDateEC } from "../utils/dateFormatter";

const t = {
  en: {
    title: "Loan History",
    book: "Book",
    dueDate: "Due Date",
    daysLeft: "Days Remaining",
    fine: "Fine",
    status: "Status",
    noBooks: "No records found",
    filterAll: "All Records",
    filterCurrent: "Currently Borrowed",
    filterHistory: "Past History",
    overdue: "overdue",
    daysRemaining: "days left"
  },
  am: {
    title: "የውሰት ታሪኬ (Loan History)",
    book: "መጽሐፍ",
    dueDate: "መመለሻ ቀን",
    daysLeft: "የቀሩት ቀናት",
    fine: "ቅጣት",
    status: "ሁኔታ",
    noBooks: "ምንም መረጃ አልተገኘም",
    filterAll: "ሁሉም",
    filterCurrent: "በውሰት ላይ ያሉ",
    filterHistory: "የቀድሞ ታሪክ",
    overdue: "ቀን ያለፈበት",
    daysRemaining: "ቀናት ቀርተዋል"
  }
};

export default function LoanHistory({ lang, setLang }) {
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const T = t[lang];

  const loadData = () => {
    setLoading(true);
    API.get("/borrow/my")
      .then((r) => {
        setMyBooks(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const getDaysLeft = (dueDate) => {
    const today = new Date(); today.setHours(0,0,0,0);
    const due = new Date(dueDate); due.setHours(0,0,0,0);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredHistory = myBooks.filter(b => filter === "all" || b.status === filter);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <h2 className="text-4xl font-outfit font-extrabold text-slate-900 tracking-tight leading-tight flex items-center gap-3">
          <span>📜</span> {T.title}
        </h2>
      </div>

      <div className="card-premium">
        <div className="flex justify-end mb-8">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
            <button 
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'all' ? 'bg-white text-primary shadow-lg shadow-black/5' : 'text-slate-500 hover:text-slate-700'}`} 
              onClick={() => setFilter('all')}
            >
              {T.filterAll}
            </button>
            <button 
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'issued' ? 'bg-white text-primary shadow-lg shadow-black/5' : 'text-slate-500 hover:text-slate-700'}`} 
              onClick={() => setFilter('issued')}
            >
              {T.filterCurrent}
            </button>
            <button 
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'returned' ? 'bg-white text-primary shadow-lg shadow-black/5' : 'text-slate-500 hover:text-slate-700'}`} 
              onClick={() => setFilter('returned')}
            >
              {T.filterHistory}
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-12">#</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">{T.book}</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">{T.dueDate}</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">{T.daysLeft}</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">{T.fine}</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">{T.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredHistory.map((r, i) => {
                  const daysLeft = r.status === 'issued' ? getDaysLeft(r.due_date) : null;
                  return (
                    <tr key={r.id || i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-400">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-primary">{r.title}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-600">{formatDateEC(r.due_date, lang)}</td>
                      <td className="px-6 py-4">
                        {r.status === 'issued' ? (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            daysLeft < 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {daysLeft < 0 ? `${Math.abs(daysLeft)} ${T.overdue}` : `${daysLeft} ${T.daysRemaining}`}
                          </span>
                        ) : <span className="text-slate-300 font-bold">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-extrabold ${r.fine > 0 ? "text-rose-600" : "text-slate-900"}`}>
                          {r.fine} ETB
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          r.status === 'issued' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filteredHistory.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="text-5xl mb-6 grayscale opacity-20">📂</div>
                      <p className="text-slate-400 font-bold text-lg">{T.noBooks}</p>
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex items-center justify-center gap-3 text-slate-400 font-bold">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
