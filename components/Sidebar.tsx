"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Menu, Settings, Home, Users, DollarSign, Shield  } from "lucide-react";
import { fetchCategories } from "@/store/categorySlice";
import { useDispatch, UseDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";

// const navItems = [
//   { name: "Главная", href: "/dashboard", icon: <Home size={20} /> },
//   { name: "Кибербезопасность", href: "/dashboard/cybersecurity", icon: <Shield size={20} /> },
//   { name: "Програмирование", href: "/dashboard/suppliers", icon: <Users size={20} /> },
//   { name: "Белый хакер", href: "dashboard/hac", icon: <Shield size={20} /> },
//   { name: "Английский", href: "/dashboard/englis", icon: <Settings size={20} /> },
  
// ];

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case "cybersecurity":
      return <Shield size={20} />;
    case "programming":
      return <Users size={20} />;
    case "english":
      return <Settings size={20} />;
    case "devops":
      return <Home size={20} />;
    default:
      return <Shield size={25} />; // иконка по умолчанию
  }
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse  }: SidebarProps) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const {categories, loading: catLoading, error} = useSelector(
    (state: RootState) => state.category
  );

  const {loading: authLoading, user} = useSelector(
    (state:RootState) => state.auth
  )

  useEffect(()=>{
    if(user && categories.length === 0){
      dispatch(fetchCategories());   
    }     
  },[dispatch, user])

  console.log("categories@@@ ", categories)

  // const [isCollapsed, setIsCollapsed] = useState(false); // ← состояние сворачивания

  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 h-screen bg-white border-r shadow-md z-20 transition-all duration-300",
        // 👉 мобилка: управляется через isOpen
        "md:translate-x-0", // на десктопе всегда виден
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0", // ← на мобилке работает
        isCollapsed ? "w-20" : "w-48"
      )}
    >
      {/* Кнопка закрытия (мобилка) */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-xl md:hidden"
      >
        ✕
      </button>

      {/* Кнопка свернуть (десктоп) */}
      <div className="hidden md:flex justify-end">
        <button
          onClick={toggleCollapse}
          className="text-gray-500 hover:text-gray-800 p-1"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <div className="mt-4 space-y-2">

        {categories.map((item) => (
         <Link
         key={item.id}
         href={`/dashboard/${ item.slug}`}
         onClick={() => {
           if (window.innerWidth < 768) {
             onClose();
           }
         }}
         className="block"
       >
         <span
           className={clsx(
             "flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 w-full",
             pathname === item.href && "bg-gray-200 font-medium"
           )}
         >
           <span className="flex-shrink-0"> {getCategoryIcon(item.slug)}</span>
           {!isCollapsed && (
             <span className="truncate">{item.name}</span>
           )}
         </span>
       </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
