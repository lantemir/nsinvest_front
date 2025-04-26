"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { usePathname } from "next/navigation";
import { fetchCoursesByCategory } from "@/store/courseSlice";
import { useAppDispatch } from "@/store/hooks";
import CyberCard from "./components/CyberCard";

const Cybersecurity = () => {
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const { categories } = useSelector((state: RootState) => state.category);
  const {courses, loading, error} = useSelector((state: RootState) => state.course)  

  useEffect(() => {
    const cyberPath = pathName.split("/")[2];
    const category = categories.find((item) => item.slug === cyberPath);

    if (category?.id) {
     
      dispatch(fetchCoursesByCategory({ categoryId: category.id, page: 1 }));
    }
  }, [categories, pathName, dispatch]); // добавлены зависимости

  if (loading) return <p>Загрузка курсов...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">    
      <p className="text-gray-600 mt-2">Раздел cybersecurity</p>
      <div className="flex flex-wrap gap-4 justify-start">
        {courses.map((course) => (
          <CyberCard key={course.id} {...course} />
        ))}
        {courses.length===0 && (
          <p className="text-gray-400 italic">Ничего не найдено</p>
        )}
      </div>
      
    </div>
  );
};

export default Cybersecurity;