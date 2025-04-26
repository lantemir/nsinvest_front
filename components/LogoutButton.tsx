"use client";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axiosWithoutInterceptor from "@/utils/axios";

const LogoutButton = () => {
    const dispatch = useDispatch();
    const router = useRouter()

    const handleLogout = async () => {
        try{          
            await axiosWithoutInterceptor.post("/api/auth/logout/", null, {
                withCredentials: true,
            } );
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