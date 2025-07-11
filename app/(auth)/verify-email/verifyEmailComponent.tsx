"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyEmail, resendVerifyEmail } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VerifyEmailComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const [verificationCode, setVerificationCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (resendDisabled && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleVerifyEmail = async () => {
    const result = await dispatch(verifyEmail({ email, code: verificationCode }));

    if (verifyEmail.fulfilled.match(result)) {
      router.push("/login?verified=1");
    } else {
      setCodeError("Неверный или уже использованный код!");
    }
  };

  const handleResendCode = async () => {
    setResendDisabled(true);
    setCountdown(60);
    const result = await dispatch(resendVerifyEmail({ email }));

    if (resendVerifyEmail.fulfilled.match(result)) {
      alert("Код повторно отправлен!");
    } else {
      setCodeError("Ошибка при повторной отправке кода!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <Card className="w-96 p-6">
        <CardHeader>
          <CardTitle className="text-xl text-center">Подтверждение Email</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-400 mb-4">
            На ваш email <strong>{email}</strong> отправлен код. Введите его ниже:
          </p>
          <Input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Код подтверждения"
            className="mt-3"
          />
          <Button onClick={handleVerifyEmail} className="w-full mt-4">
            Подтвердить
          </Button>
          {codeError && <p className="text-red-500 text-center">{codeError}</p>}
          <div className="text-center mt-4 text-sm text-gray-400">
            Не получили код?{" "}
            <button
              onClick={handleResendCode}
              disabled={resendDisabled}
              className={`text-blue-500 ${resendDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {resendDisabled ? `Отправить снова через ${countdown}с` : "Отправить повторно"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
