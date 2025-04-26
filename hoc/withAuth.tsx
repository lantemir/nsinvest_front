"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosWithoutInterceptor from "@/utils/axios";
import { useDispatch } from "react-redux";

const withAuth = (WrappedComponent: any) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      console.log("withAuth@@@")
      let isMounted = true; // защита от setState после размонтирования

      const checkAuth = async () => {
        const token = sessionStorage.getItem("token");

        // Если access_token есть — просто продолжаем
        if (token) {
          setLoading(false);
          return;
        }

        // Иначе пробуем обновить access_token через refresh
        try {
          const response = await axiosWithoutInterceptor.post(
            "/api/auth/refresh/",
            null,
            {
              withCredentials: true,
            }
          );

          const newAccessToken = response.data?.access;

          

          if (newAccessToken) {
            sessionStorage.setItem("token", newAccessToken);

            

            // 🕐 Добавим задержку, чтобы сервер успел обновить куку           
          
            console.log("newAccessToken@@@ " , newAccessToken);

            // 🔐 Получаем текущего пользователя
            const userRes = await axiosWithoutInterceptor.get("api/auth/me/", {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });

            console.log("userRes@@@ " , userRes)

            const user = userRes.data;
            sessionStorage.setItem("user", JSON.stringify(user));

            dispatch({
              type: "auth/loginUser/fulfilled",
              payload: {
                access: newAccessToken,
                user,
              },
            });

            if (isMounted) {
              setLoading(false);
            }
          } else {
            sessionStorage.removeItem("token");
            router.push("/login");
          }
        } catch (err) {
          console.error("Ошибка обновления токена:", err);
          sessionStorage.removeItem("token");
          router.push("/login");
        }
      };

      checkAuth();

      return () => {
        isMounted = false;
      };
    }, [router, dispatch]);

    if (loading) {
      return <p>Проверка авторизации...</p>;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;