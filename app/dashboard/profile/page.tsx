"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/utils/axios";

import { refreshUser } from "@/store/authSlice";
import { RootState, AppDispatch } from "@/store/store";

export default function ProfileForm() {
  const {user} = useSelector ((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>();

  const [avatar, setAvatar] = useState<File | null>(null);
  const [phone, setPhone] = useState(user?.profile?.phone_number || "");

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (avatar) formData.append("profile.avatar", avatar);
    formData.append("profile.phone_number", phone);

    try {
      const res = await api.patch("/api/auth/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(refreshUser());
      alert("Профиль обновлен");      
    } catch (e) {
      console.error("Ошибка при обновлении профиля", e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Профиль пользователя</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Телефон
        </label>
        <input
          type="number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+7 777 1234567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Аватар (JPEG/PNG, до 2MB)
        </label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              const file = e.target.files[0];
              if (file.size > 2 * 1024 * 1024) {
                alert("Файл слишком большой. Макс: 2MB");
                return;
              }
              setAvatar(file);
            }
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-gray-700 hover:file:bg-blue-100"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Сохранить
      </button>
    </form>
  );
}
