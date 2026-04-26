import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import api from "../api";

const Login = () => {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // ✅ SEND USER TO BACKEND
      await api.post("/users/save", {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
      });

      toast.success("Logged in successfully 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Login failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#080c14] text-white font-['DM_Sans',sans-serif] overflow-hidden relative">

      {/* BG ORBS */}
      <div className="absolute w-80 h-80 rounded-full blur-[80px] bg-[#1a3a6a] opacity-50 -top-16 -left-16 pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full blur-[80px] bg-[#0d2a50] opacity-40 bottom-0 left-1/3 pointer-events-none" />
      <div className="absolute w-52 h-52 rounded-full blur-[80px] bg-[#1e3f7a] opacity-35 top-1/3 -right-12 pointer-events-none" />

      {/* LEFT PANEL */}
      <div className="hidden md:flex w-[55%] flex-col justify-center px-14 py-12 relative z-10">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-11">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M18 20V10M12 20V4M6 20v-6" />
            </svg>
          </div>
          <span className="font-['Sora',sans-serif] font-semibold text-[17px] text-slate-100 tracking-tight">Cloud Notes</span>
        </div>

        {/* Headline */}
        <h1 className="font-['Sora',sans-serif] text-5xl font-bold leading-[1.18] tracking-tight text-slate-50 mb-4">
          Your files,<br />
          always <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">within reach</span>
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed mb-5 max-w-sm">
          Store, organise, and share documents securely — from anywhere, on any device.
        </p>

        {/* Preview card */}
        <div className="bg-[#0f1827] border border-[#1e3148] rounded-2xl p-5 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="ml-2 text-[13px] text-slate-600 font-['Sora',sans-serif]">My Drive</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: "📄", name: "Report.pdf", size: "2.4 MB", bg: "bg-[#1e3a5f]" },
              { icon: "📊", name: "Data.xlsx", size: "840 KB", bg: "bg-green-900/20 border border-green-800/30" },
              { icon: "🖼️", name: "Banner.png", size: "1.1 MB", bg: "bg-amber-900/10 border border-amber-700/20" },
            ].map((f) => (
              <div key={f.name} className="bg-[#141e2e] border border-[#1e3148] rounded-xl p-3 flex flex-col gap-1.5">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[13px] ${f.bg}`}>{f.icon}</div>
                <div className="text-sm text-slate-400 font-medium">{f.name}</div>
                <div className="text-[11px] text-slate-600">{f.size}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-2.5">
          {["Upload & organise files with ease", "Star favourites for instant access", "Trash & restore — nothing is lost", "Share securely with your groups"].map((f) => (
            <div key={f} className="flex items-center gap-2.5 text-[16px] text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-[45%] flex items-center justify-center px-8 py-10 relative z-10 border-l border-[#1e3148]">
        <div className="w-full max-w-[340px]">

          <h2 className="font-['Sora',sans-serif] text-4xl font-bold text-slate-100 tracking-tight mb-1.5">Welcome back</h2>
          <p className="text-[15px] text-slate-500 mb-8 leading-relaxed">Sign in to access your personal cloud workspace</p>

          {/* Stats
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[["15 GB", "Free storage"], ["256-bit", "Encryption"], ["99.9%", "Uptime"]].map(([num, label]) => (
              <div key={label} className="bg-[#0f1827] border border-[#1e3148] rounded-xl p-3 text-center">
                <span className="block font-['Sora',sans-serif] text-base font-bold text-blue-400">{num}</span>
                <div className="text-[10px] text-slate-600 mt-0.5">{label}</div>
              </div>
            ))}
          </div> */}

          {/* Feature Highlight Cards */}
          <div className="flex flex-col gap-2 mb-6">
            {[
              { icon: "⚡", title: "Instant sync across devices", desc: "Changes reflect everywhere in real time — no manual refresh needed.", bg: "bg-[#1e3a5f]" },
              // { icon: "🔒", title: "End-to-end encryption", desc: "Your files are locked before they leave your device. Always private.", bg: "bg-[#2d1b69]" },
              { icon: "🔗", title: "One-click sharing", desc: "Share a secure link with anyone — no account required on their end.", bg: "bg-[#0d3a30]" },
            ].map((f) => (
              <div key={f.title} className="bg-[#0f1827] border border-[#1e3148] hover:border-[#2a4a70] rounded-xl p-3 flex items-center gap-3 transition-colors">
                <div className={`w-9 h-9 rounded-[9px] flex items-center justify-center text-[15px] shrink-0 ${f.bg}`}>{f.icon}</div>
                <div>
                  <div className="text-[15px] font-medium text-slate-300 mb-0.5">{f.title}</div>
                  <div className="text-[13px] text-slate-600 leading-snug">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#1e3148]" />
            <span className="text-[13px] text-slate-700 tracking-wider">CONTINUE WITH</span>
            <div className="flex-1 h-px bg-[#1e3148]" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleLogin}
            className="w-full cursor-pointer flex items-center justify-center gap-2.5 py-3 px-5 bg-slate-50 hover:bg-slate-200 active:scale-[0.98] rounded-xl text-[16px] font-medium text-slate-900 transition-all duration-150 mb-6"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-[18px] h-[18px] " />
            Continue with Google
          </button>

          {/* Terms */}
          <p className="text-[13px] text-slate-700 text-center leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-500">Terms of Service</a> and{" "}
            <a href="#" className="text-blue-500">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;