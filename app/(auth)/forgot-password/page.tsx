"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { forgotPassword } from "@/store/authSlice";

export default function ForgotPasswordPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    setStatus(""); // Сброс предыдущего статуса

    const result = await dispatch(forgotPassword({ email }));

    if (forgotPassword.fulfilled.match(result)) {
      setStatus("📩 Письмо с инструкциями отправлено на почту.");
    } else {
      setStatus("❌ Ошибка: " + (result.payload?.error || "не удалось отправить письмо"));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-4">Восстановление пароля</h2>
        <Input
          type="email"
          placeholder="Введите ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleSubmit} className="w-full mt-4">
          Отправить
        </Button>
        {status && <p className="text-center text-sm text-gray-600 mt-2">{status}</p>}
      </div>
    </div>
  );
}