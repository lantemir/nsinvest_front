"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import LogoutButton from "@/components/LogoutButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {
    const { user, token } = useSelector((state: RootState) => state.auth);

    const router = useRouter();

    useEffect(()=> {
        if(!user || !token){
            router.push('/login')
        }
        
    }, [user, token, router])

    if(!user || !token){
        return <p>Перенапрвление на страницу входа...</p>
    }

    return(
        <div className="p-6">
            <h1 className="text-2xl font-bold">Добро пожаловать, {user?.username}!</h1>
 
      <LogoutButton /> {/* ✅ Кнопка выхода */}
    </div>

    )
}

export default Dashboard