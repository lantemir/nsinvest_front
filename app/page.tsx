// "use client";

import Link from "next/link";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";


export default function Home() {

  // const router = useRouter();

  // useEffect(() => {
  //   const token = sessionStorage.getItem("token");
  //   if (token) {
  //     router.replace("/dashboard"); // 👈 заменяет текущий маршрут
  //   }
  // }, [router]);



  return (
    <div className="">      
      <h1>Главная</h1>
      <Link href="/dashboard" className="text-blue-500">
      dashboard
            </Link>
     
    </div>
  );
}
