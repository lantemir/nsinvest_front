"use client";
import Link from "next/link";
import React from "react";
import LogoutButton from "./LogoutButton";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
      <div className="flex items-center gap-2">
      
        <button
          onClick={toggleSidebar}
          className="md:hidden text-2xl text-gray-700"
        >
          ☰
        </button>
      </div>

      <div className="flex items-center gap-2">
         
        <Link href="/dashboard/profile" className="bg-gray-200 px-3 py-1 rounded">Профиль {user?.username} </Link>
        <LogoutButton /> 
      </div>
    </div>
  );
};

export default Navbar;