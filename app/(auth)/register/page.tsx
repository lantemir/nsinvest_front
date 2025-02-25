"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/authSlice";
import { RootState, AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }

    const result = await dispatch(registerUser({ username, email, password }));
    if (registerUser.fulfilled.match(result)) {
      router.push(`/verify-email?email=${email}`); // ✅ После регистрации переходим на верификацию email
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <Card className="w-96 p-6">
        <CardHeader>
          <CardTitle className="text-xl text-center">Регистрация</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Имя пользователя"
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите пароль"
            />
            <Button onClick={handleRegister} disabled={loading} className="w-full">
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>
          <div className="text-center mt-4 text-sm">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-blue-500">
              Войти
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}