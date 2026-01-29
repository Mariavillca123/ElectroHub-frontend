import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "cliente" as "cliente" | "vendedor",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API_URL}/api/auth/register`, form);
      alert("Registro exitoso, regresa al login e inicia sesión");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Registro</h2>

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          type="button"
          onClick={() => setForm({ ...form, role: "cliente" })}
          className={`p-2 border rounded ${form.role === "cliente" ? "border-primary bg-primary/10" : "border-gray-200"}`}
        >
          Cliente
        </button>
        <button
          type="button"
          onClick={() => setForm({ ...form, role: "vendedor" })}
          className={`p-2 border rounded ${form.role === "vendedor" ? "border-primary bg-primary/10" : "border-gray-200"}`}
        >
          Vendedor
        </button>
      </div>

      <input
        className="w-full border p-2 mb-3"
        placeholder="Nombre"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        className="w-full border p-2 mb-3"
        type="email"
        placeholder="Correo"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        type="password"
        className="w-full border p-2 mb-4"
        placeholder="Contraseña"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        required
      />

      <button className="w-full bg-primary text-white py-2 rounded">
        Registrarse
      </button>
    </form>
  );
}