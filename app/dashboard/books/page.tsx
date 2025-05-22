"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchBooks } from "@/store/bookSlice";
import { fetchCategories } from "@/store/categorySlice";
import { AppDispatch } from "@/store/store";
import { RootState } from "@/store/store";

import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { BASE_URL } from "@/src/config";
import Pagination from "@/components/Pagination";
import { Category } from "@/store/categorySlice";

const Books = () => {

  const dispatch = useAppDispatch()
  const [page, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState(""); // default сортировка

  const {books, totalPages , currentPage, } = useSelector((state:RootState)=> state.book )
  const {categories} = useSelector((state:RootState)=> state.category)

  useEffect(()=> {
    // dispatch(fetchBooks({ page: page }));
    dispatch(fetchCategories())
  },[dispatch]) 

  useEffect(()=> {
    dispatch(fetchBooks({  page: page , category_id: sortOption || "" }));
  },[page, sortOption, dispatch])
  


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Книги и материалы</h1>

      <div className="mb-4">
        <label htmlFor="sort" className="mr-2 font-medium">Сортировка:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => {setSortOption(e.target.value) } }
          className="border border-gray-300 rounded px-3 py-1"
        >
          <option value="">Сортировать по...</option>
          {categories.filter((item) => item?.path?.includes("dashboard/category"))
            .map((item) => (
            <option key={item.id} value={item.id}> {item.name} </option>
          )
          )}     
        </select>
      </div>

      {books?.length === 0 && (
          <div className=" flex text-xl  mb-6 ">нет книг по данной категории</div>
        )
      }

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col justify-between min-h-[400px]"
          >
            <Image
              src={`${BASE_URL}${book.cover}`}
              alt={`Обложка книги ${book.title}`}
              width={400}
              height={250}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 flex flex-col h-full justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">{book.title}</h2>
                <p className="text-gray-600 text-sm mb-3">{book.description}</p>
              </div>
              <a
                href={`${BASE_URL}${book.file}`}
                download
                className="mt-4 block bg-blue-600 text-white text-center px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              >
                📥 Скачать
              </a>
            </div>
          </div>
        ))}
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

export default Books