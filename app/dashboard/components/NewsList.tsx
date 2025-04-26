"use client";
import { useEffect, useState} from "react";
import NewsCard from "./NewsCard";
import { mockTenders } from "@/src/data/tenders";
import Pagination from "@/components/Pagination";
import { useAppDispatch } from "@/store/hooks";
import { fetchCoursesByCategory } from "@/store/courseSlice";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const NewsList = () => {
  const dispatch = useAppDispatch();

  const {courses, loading: courseLoading, error} = useSelector(
    (state: RootState) => state.course
  );

  const [query, setQuery] = useState("")

  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);  

  // const filteredTenders = mockTenders.filter((tender)=>
  //   tender.title.toLowerCase().includes(query.toLowerCase())
  // )

  const filteredCourses = courses.filter((tender)=>
    tender.title.toLowerCase().includes(query.toLowerCase())
  )
  courses


  useEffect(()=> {
    dispatch(fetchCoursesByCategory({ categoryId: 1, page: 1 }))
  },[])

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleCourses = filteredCourses.slice(startIndex, endIndex);
  
  return (
    <div>
      <input
        type="text"
        placeholder="Поиск по названию"
        value={query}
        onChange={(e)=>setQuery(e.target.value)}
        className="mb-4 px-3 py-2 border rounded w-full md:w-1/2"
      />
      
      <div className="flex flex-wrap gap-4 justify-start">
        {visibleCourses.map((course) => (
          <NewsCard deadline={""} status={""} itemsCount={0} key={course.id} {...course} />
        ))}
        {visibleCourses.length===0 && (
          <p className="text-gray-400 italic">Ничего не найдено</p>
        )}
      </div>


      <div className="flex justify-center">
        <Pagination
          totalItems={filteredCourses.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
     

    </div>

  );
};

export default NewsList;