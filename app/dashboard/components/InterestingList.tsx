"use client";
import { useEffect, useMemo, useState } from "react";

import Pagination from "@/components/Pagination";
import { useAppDispatch } from "@/store/hooks";
import { fetchInterestingByCategory } from "@/store/mainSlice";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import debounce from "lodash.debounce";
import Link from "next/link";
import img253 from "@/src/images/253.jpeg"
import Image from "next/image";
import { BASE_URL } from "@/src/config";

const InterestingList = () => {
  const dispatch = useAppDispatch();
  const { interesting, loading, totalPages } = useSelector(
    (state: RootState) => state.interesting
  );

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Объединённый useEffect: запрос при изменении страницы или debouncedQuery
  useEffect(() => {
    dispatch(fetchInterestingByCategory({ categoryId: 1, page: currentPage, search: debouncedQuery }));
  }, [currentPage, debouncedQuery, dispatch]);

  // ✅ Debounce только search, не сбрасывай page здесь
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
        placeholder="Поиск по названию..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          debouncedSetQuery(e.target.value);
        }}
        className="mb-4 px-3 py-2 border rounded w-full md:w-1/2"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {interesting.map((interest) => (
          <Link key={interest.id} href={`/dashboard/${interest.id}`}>
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
              <Image
                src={`${BASE_URL}${interest.cover}`}
                alt="Изображение новости"
                width={600}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-base  text-gray-800 hover:text-blue-600 transition">
                  {interest.title}
                </h2>
              </div>
            </div>
          </Link>
        ))}

        {interesting.length === 0 && (
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
};

export default InterestingList;