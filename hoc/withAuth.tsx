
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios"; // с интерсепторами для обычной работы
import rawAxios from "@/utils/axios"; // если нужен «без»
import { axiosPlain } from "@/utils/axios"; // ← берём ПЛОСКИЙ
import { useDispatch } from "react-redux";

const withAuth = (WrappedComponent: any) => {
  const Authenticated = (props: any) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let cancelled = false;

      const proceed = (access: string, user: any) => {
        sessionStorage.setItem("token", access);
        sessionStorage.setItem("user", JSON.stringify(user));
        dispatch({
          type: "auth/loginUser/fulfilled",
          payload: { access, user },
        });
        if (!cancelled) setLoading(false);
      };

      const redirectToLogin = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        router.replace("/login");
      };

      const checkAuth = async () => {
        try {
          const stored = sessionStorage.getItem("token");

          // 1) если есть токен — валидируем его
          if (stored) {
            try {
              const me = await axiosPlain.get("api/auth/me/", {
                headers: { Authorization: `Bearer ${stored}` },
                withCredentials: true,
              });
              return proceed(stored, me.data);
            } catch {
              // 401/expired → падаем в refresh
            }
          }

          // 2) пробуем refresh по httpOnly cookie
          const r = await axiosPlain.post("/api/auth/refresh/", null, {
            withCredentials: true,
          });
          const newAccess = r.data?.access;
          if (!newAccess) return redirectToLogin();

          const me = await axiosPlain.get("api/auth/me/", {
            headers: { Authorization: `Bearer ${newAccess}` },
            withCredentials: true,
          });

          return proceed(newAccess, me.data);
        } catch (e) {
          return redirectToLogin();
        }
      };

      checkAuth();
      return () => { cancelled = true; };
      // намеренно []
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <p>Проверка авторизации…</p>;
    return <WrappedComponent {...props} />;
  };

  return Authenticated;
};

export default withAuth;