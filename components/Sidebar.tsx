"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, MouseEvent, useCallback } from "react";
import clsx from "clsx";
import { Shield, House, Code, Blocks, BookOpenText, Calendar1, Earth } from "lucide-react";
import { fetchCategories } from "@/store/categorySlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case "cybersecurity": return <Shield size={20} />;
    case "programming":  return <Code size={20} />;
    case "english":      return <Earth size={20} />;
    case "books":        return <BookOpenText size={20} />;
    case "devops":       return <Blocks size={20} />;
    case "meeting":      return <Calendar1 size={20} />;
    default:             return <House size={25} />;
  }
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export default function Sidebar({
  isOpen, onClose, isCollapsed, toggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { categories } = useSelector((s: RootState) => s.category);
  const { user } = useSelector((s: RootState) => s.auth);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (user && categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, user, categories.length]);

  const stop = (e: MouseEvent) => e.stopPropagation();

  // клик по «фону» самой панели — сворачиваем на десктопе
  const handleAsideClick = useCallback((e: MouseEvent<HTMLElement>) => {
    if (window.innerWidth < 768) return;        // на мобилке кликаем по overlay
    if (animating) return;
    if (e.currentTarget !== e.target) return;   // клики по детям игнорим
    setAnimating(true);
    toggleCollapse();
  }, [animating, toggleCollapse]);

  return (
    <>
      {/* ==== OVERLAY (мобилка) ==== */}
      <div
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-10 bg-black/30 md:hidden transition-opacity",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* ==== SIDEBAR ==== */}
      <aside
        onClick={handleAsideClick}
        onTransitionEnd={() => setAnimating(false)}
        className={clsx(
          "fixed top-0 left-0 h-screen bg-white border-r shadow-md z-20",
          // Анимируем transform для въезда/выезда и width для сворачивания
          "transition-[transform,width] duration-200 will-change-[transform,width]",
          // мобилка: сдвигаем панель за экран (isOpen управляет видимостью вместе с overlay)
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          // десктоп: реальная смена ширины
          isCollapsed ? "md:w-20 w-64" : "md:w-56 w-64"
        )}
        role="navigation"
        aria-expanded={!isCollapsed}
      >
        {/* крестик (мобилка) */}
        <button
          onClick={(e) => { stop(e); onClose(); }}
          className="absolute top-4 right-4 text-xl md:hidden"
          aria-label="Закрыть меню"
        >
          ✕
        </button>

        {/* стрелка (десктоп) */}
        <div className="hidden md:flex items-center justify-end px-2 py-2">
          <button
            onClick={(e) => { stop(e); if (!animating) { setAnimating(true); toggleCollapse(); } }}
            className="text-gray-500 hover:text-gray-800 p-1"
            aria-label={isCollapsed ? "Развернуть боковую панель" : "Свернуть боковую панель"}
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>

        <div className="mt-2 space-y-1 px-2">
          {categories.map((item) => {
            const href = item.path;
            const active = (href === "/") ? pathname === "/dashboard" : pathname.startsWith(href);

            return (
              <Link
                key={item.id}
                href={href}
                onClick={(e) => {
                  stop(e);
                  if (window.innerWidth < 768) onClose(); // на мобилке закрываем после выбора
                }}
                className={clsx(
                  "flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100",
                  active && "bg-gray-200 font-medium"
                )}
              >
                <span className="flex-shrink-0">{getCategoryIcon(item.slug)}</span>

                {/* подпись: плавно прячем/показываем + чтобы колонки не прыгали */}
                <span
                  className={clsx(
                    "whitespace-nowrap overflow-hidden transition-[opacity,transform] duration-200",
                    isCollapsed ? "opacity-0 -translate-x-2 w-0" : "opacity-100 translate-x-0"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
