"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "@/utils/axios";
import { RootState, AppDispatch } from "@/store/store";
import { refreshUser, changePassword } from "@/store/authSlice";
import { BASE_URL } from "@/src/config";

export default function ProfileForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [avatar, setAvatar] = useState<File | null>(null);
  const [phone, setPhone] = useState(user?.profile?.phone_number || "");
  const [email, setEmail] = useState(user?.email || "");

  // 👇 новое состояние для смены пароля
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setPhone(user?.profile?.phone_number || "");
    setEmail(user?.email || "");
  }, [user?.profile?.phone_number, user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (avatar) formData.append("profile.avatar", avatar);
    formData.append("profile.phone_number", phone);
    formData.append("email", email);   

    try {
      await api.patch("/api/auth/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(refreshUser());
      alert("Профиль обновлён");
    } catch (e) {
      console.error("Ошибка при обновлении профиля", e);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      return alert("Заполните оба поля");
    }
    if (newPassword !== confirmPassword) {
      return alert("Пароли не совпадают");
    }

    try {
      await dispatch(
        changePassword({ username: user!.username, password: newPassword })
      ).unwrap();
      alert("Пароль успешно изменён");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      alert(err?.error || "Ошибка смены пароля");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Профиль пользователя</h2>

      {/* Аватарка */}
      <div className="flex flex-col items-center space-y-3">
        {user?.profile?.avatar ? (
          <img
            src={`${BASE_URL}${user.profile.avatar ?? ""}`}
            alt="Аватар"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow-md"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            Нет фото
          </div>
        )}
      </div>

      {/* Загрузка нового аватара */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Загрузить новый аватар</label>
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

      {/* Телефон */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+7 777 1234567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="tel"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ваш email"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Сохранить профиль
      </button>

      {/* 🔐 Смена пароля */}
      <hr />
      <h3 className="text-lg font-semibold text-gray-700 mt-6">Сменить пароль</h3>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Новый пароль"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Повторите пароль"
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />
      <button
        type="button"
        onClick={handleChangePassword}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Сменить пароль
      </button>
    </form>
  );
}
