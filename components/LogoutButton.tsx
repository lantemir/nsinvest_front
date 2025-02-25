"use client";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/utils/axios";

const LogoutButton = () => {
    const dispatch = useDispatch();
    const router = useRouter()

    const handleLogout = async () => {
        try{
            // ❌ Очищаем refresh_token (сервер должен удалить cookie)
            await api.post("/api/auth/logout/");
        } catch (error) {
            console.error("Оибка выхода", error)
        }
        dispatch(logout());
        router.push('/login');
    }

    return (
        <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
            Выйти
        </Button>
    )

}

export default LogoutButton;