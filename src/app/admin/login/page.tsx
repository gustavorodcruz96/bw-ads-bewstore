"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/bew-logo.png"
            alt="Bew Store"
            className="h-12 w-auto mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-white">Painel Administrativo</h1>
          <p className="text-gray-500 text-sm mt-1">
            Acesse com suas credenciais
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-800 bg-white/[0.03] p-6 space-y-5"
        >
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoFocus
                className="w-full rounded-xl border border-gray-800 bg-gray-900 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#D2A89B]/50 focus:border-[#D2A89B]/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-gray-800 bg-gray-900 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#D2A89B]/50 focus:border-[#D2A89B]/50 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl btn-premium disabled:opacity-50 text-white font-semibold py-2.5 text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          Acesso restrito a administradores
        </p>
      </div>
    </div>
  );
}
