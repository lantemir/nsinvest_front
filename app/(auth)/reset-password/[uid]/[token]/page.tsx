"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/utils/axios";
import { resetPassword } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";
import { useDispatch, UseDispatch } from "react-redux";

export default function ResetPasswordPage() {

  const { uid, token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  // Проверка типов
  if (typeof uid !== "string" || typeof token !== "string") {
    return (
      <div className="text-center mt-10 text-red-500">
        Некорректная ссылка для сброса пароля
      </div>
    );
  }

  const handleReset = async () => {
    try {
        dispatch( resetPassword({uid, token,password})).unwrap();
      setStatus("✅ Пароль успешно изменён. Сейчас вы будете перенаправлены...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setStatus("❌ Ошибка сброса пароля: " + (err.response?.data?.error || "неизвестная ошибка"));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-4">Новый пароль</h2>
        <Input
          type="password"
          placeholder="Введите новый пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleReset} className="w-full mt-4">
          Сбросить пароль
        </Button>
        {status && <p className="text-center text-sm text-gray-600 mt-2">{status}</p>}
      </div>
    </div>
  );
}
