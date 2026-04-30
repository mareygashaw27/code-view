import { useState } from "react";
import API from "../api";

const t = {
  en: { title:"Library System", subtitle:"Sign in to continue", username:"Username", password:"Password", role:"Role", admin:"Admin", manager:"Librarian", member:"Member", signin:"Sign In", signing:"Signing in...", noAccount:"Don't have an account?", register:"Register here", forgot: "Forgot Password?" },
  am: { title:"የቤተ መጻሕፍት ሥርዓት", subtitle:"ለመቀጠል ይግቡ", username:"የተጠቃሚ ስም", password:"የይለፍ ቃል", role:"ሚና", admin:"አድሚን", manager:"Librarian", member:"አባል", signin:"ግባ", signing:"በመግባት ላይ...", noAccount:"መለያ የለዎትም?", register:"እዚህ ይመዝገቡ", forgot: "የይለፍ ቃል ረስተዋል?" },
};

export default function Login({ onLogin, onSwitch, lang, setLang }) {
  const [form,    setForm]    = useState({ username: "", password: "", role: "admin" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const T = t[lang];

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user",  JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check backend is running.");
    }
    setLoading(false);
  };


  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-[420px] px-6 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Language Switcher */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setLang(lang === "en" ? "am" : "en")} 
            className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-xs font-bold backdrop-blur-md"
          >
            🌐 {lang === "en" ? "አማርኛ" : "English"}
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl shadow-black/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-primary/30 mx-auto mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              📚
            </div>
            <h1 className="text-3xl font-outfit font-black text-white tracking-tight mb-2">
              {T.title}
            </h1>
            <p className="text-slate-400 font-medium text-sm">
              {T.subtitle}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center animate-in zoom-in-95 duration-300">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{T.username}</label>
              <input 
                name="username" 
                value={form.username} 
                onChange={handle} 
                required 
                className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-300 font-medium"
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{T.password}</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={form.password} 
                  onChange={handle}
                  required 
                  className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-300 font-medium"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-white">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{T.role}</label>
              <select 
                name="role" 
                value={form.role} 
                onChange={handle}
                className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-300 font-medium cursor-pointer appearance-none"
              >
                <option value="admin" className="bg-slate-900">{T.admin}</option>
                <option value="librarian" className="bg-slate-900">{T.manager}</option>
                <option value="student" className="bg-slate-900">{T.member}</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-white font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  {T.signing}
                </span>
              ) : T.signin}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 space-y-4 text-center">
            <p className="text-slate-400 text-sm font-medium">
              {T.noAccount}{" "}
              <button onClick={onSwitch} className="text-primary font-bold hover:underline underline-offset-4 decoration-2 transition-all">
                {T.register}
              </button>
            </p>
            <button 
              onClick={() => window.location.href = "/forgot-password"}
              className="text-slate-500 hover:text-white text-xs font-bold transition-colors"
            >
              {T.forgot}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
            <button 
              onClick={() => window.location.href = "/books"}
              className="w-full py-4 rounded-2xl bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-500 text-xs font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/30 animate-bounce hover:animate-none"
            >
              <span className="text-xl">🔍</span> {lang === "en" ? "Browse as Guest" : "እንደ እንግዳ ፈልግ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
