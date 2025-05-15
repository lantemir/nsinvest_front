"use client";
import {useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "@/store/authSlice";
import { RootState, AppDispatch } from "@/store/store";
import { useRouter, useSearchParams  } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, token } = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams(); // ✅ Получаем параметры из URL

  const emailVerified = searchParams.get("verified") === "1";

  // ✅ Если есть `token`, редиректим на `dashboard`
  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);


    // ✅ Очищаем ошибку, если email подтвержден
    useEffect(() => {
      if (emailVerified) {
        dispatch(clearAuthError());
      }
    }, [emailVerified, dispatch]);  
  // ✅ Проверяем, был ли email подтвержден


  const handleLogin = async () => {
    const result = await dispatch(loginUser({ username, password }));

    if (loginUser.fulfilled.match(result)) {
      router.push("/dashboard");
    } else if ( loginUser.rejected.match(result) && result.payload?.error?.includes("Подтвердите email перед входом")) {
       // ✅ Передаем email из rejectWithValue, если он есть
       router.push(`/verify-email?email=${result.payload.email}`);
    } else {
      alert(alert(result.payload || "Ошибка входа"))
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <Card className="w-96 p-6">
        <CardHeader>
          <CardTitle className="text-xl text-center">Вход</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ✅ Показываем сообщение, если email был подтвержден */}
          {emailVerified && (
            <p className="text-green-500 text-center mb-4">
              ✅ Ваш email успешно подтвержден. Теперь вы можете войти.
            </p>
          )}
          <div className="space-y-4">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Имя пользователя"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
            />
            <Button className="w-full" onClick={handleLogin} disabled={loading}>
              {loading ? "Вход..." : "Войти"}
            </Button>
          
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>
          <div className="text-center mt-4 text-sm mb-4">
            <div className="text-center text-sm mt-1 mb-4">
              <Link href="/forgot-password" className="text-blue-500 hover:underline">
                Забыли пароль?
              </Link>
            </div>
            Нет аккаунта?{" "}
            <Link href="/register" className="text-blue-500">
              Зарегистрироваться
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
