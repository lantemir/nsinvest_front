"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchCoursesByName, resetCourses } from "@/store/courseSlice";
import { useAppDispatch } from "@/store/hooks";
import Image from "next/image";
import { BASE_URL } from "@/src/config";
import debounce from "lodash.debounce";
import Pagination from "@/components/Pagination";

export default function CategoryPage() {


  const { category, course, lessonId } = useParams();
  const dispatch = useAppDispatch()

  const { courses, totalPages, error } = useSelector((state: RootState) => state.course);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (typeof category === "string") {
      dispatch(fetchCoursesByName({ categoryName: category, page: currentPage, search: debouncedQuery }));
    }
  }, [category, currentPage, debouncedQuery, dispatch]);

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedQuery(value);
        setCurrentPage(1); // сброс при новом поиске
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  return (
    <div>
      <input
        type="text"
        placeholder="Поиск по названию"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          debouncedSetQuery(e.target.value);
        }}
        className="mb-4 px-3 py-2 border rounded w-full md:w-1/2"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {courses.map((course) => (
          <Link key={course.id} href={`/dashboard/category/${category}/${course.id}`}>
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
              <Image
                src={`${BASE_URL}${course.thumbnail}`}
                alt="Изображение новости"
                width={600}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl text-gray-800 hover:text-blue-600 transition min-h-[72px]">
                  {course.title}
                </h2>
              </div>
            </div>
          </Link>
        ))}

        {courses.length === 0 && (
          <p className="text-gray-400 italic col-span-full text-center">
            Ничего не найдено
          </p>
        )}


      </div>
      <div className="flex justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}


