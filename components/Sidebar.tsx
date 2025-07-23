"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import clsx from "clsx";
import { Menu, Settings, Home, Users, Shield } from "lucide-react";
import { fetchCategories } from "@/store/categorySlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";

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
      return <Shield size={25} />;
  }
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }: SidebarProps) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { categories } = useSelector((state: RootState) => state.category);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user && categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, user]);

  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 h-screen bg-white border-r shadow-md z-20 transition-all duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        `${isCollapsed ? "w-20" : "w-64"} md:${isCollapsed ? "w-20" : "w-48"}`
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
      {categories.map((item) => {
  const targetHref = item.path;

  const isMainPage = targetHref === "/";
  const isActive = isMainPage
    ? pathname === "/dashboard"
    : pathname.startsWith(targetHref)

  return (
    <Link
      key={item.id}
      href={targetHref}
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
          isActive && "bg-gray-200 font-medium"
        )}
      >
        <span className="flex-shrink-0">{getCategoryIcon(item.slug)}</span>
        {!isCollapsed && <span className="">{item.name}</span>}
      </span>
    </Link>
  );
})}
      </div>
    </aside>
  );
};

export default Sidebar;
