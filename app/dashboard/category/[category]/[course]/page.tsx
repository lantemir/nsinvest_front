
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchLessonsByCourse, fetchLessonById, resetLessons } from "@/store/lessonSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import clsx from "clsx";
import Pagination from "@/components/Pagination";


export default function LessonPage() {
  const { course } = useParams();
  const dispatch = useAppDispatch();

  const { currentLesson, lessons, totalPages } = useSelector(
    (state: RootState) => state.lesson
  );
  const [currentPage, setCurrentPage] = useState(1);

  const changeLesson = (lessonId: number) => {
    dispatch(fetchLessonById({ lessonId: Number(lessonId) }));
  };

  // 1) Сброс при смене курса + старт с первой страницы
  useEffect(() => {
    dispatch(resetLessons());
    setCurrentPage(1);                       // ← NEW
  }, [course, dispatch]);                    // ← NEW

  // 2) Загружаем уроки при изменении currentPage (и course)
  useEffect(() => {                          // ← NEW block
    const loadPage = async () => {
      if (!course) return;

      const action = await dispatch(
        fetchLessonsByCourse({ courseId: Number(course), page: currentPage })
      );

      // Если текущего урока нет на этой странице — выбираем первый из нее
      if (
        fetchLessonsByCourse.fulfilled.match(action) &&
        action.payload.data.length > 0 &&
        !action.payload.data.some((l: any) => l.id === currentLesson?.id)
      ) {
        const firstId = action.payload.data[0].id;
        dispatch(fetchLessonById({ lessonId: firstId }));
      }
    };

    loadPage();
  }, [course, currentPage, dispatch]);        // ← NEW deps
   

    return (
 
        <div className="flex flex-col lg:flex-row p-4 gap-6">          
         
            <div className="flex-1">
                {currentLesson ?  (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>

                       
                    
                   
                        {currentLesson.content && <div className="w-full max-w-3xl mb-10">
                            <div
                                className="prose prose-lg"
                                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                            />
                        </div>
                        }
                 

                        {currentLesson.video && <div className="w-full max-w-3xl aspect-video overflow-hidden rounded-lg shadow-md mx-auto [&_iframe]:w-full [&_iframe]:h-full">
                            <div
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ __html: currentLesson.video }}
                            />
                        </div>
                        }
                    </div>
                ) : <div>Урока нету</div>}
            </div>

            {/* Сайдбар с уроками */}
            <div className="w-full lg:w-32 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6 max-h-[300px] lg:max-h-[80vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-3">Уроки</h2>
                <ul className="space-y-2">
                    {lessons.map((lesson) => (
                        <li key={lesson.id} className={clsx(
                                    "text-left w-full cursor-pointer",
                                    lesson.id === currentLesson?.id
                                        ? "text-gray-800 font-bold underline"
                                        : "text-gray-600 hover:underline"
                                )}
                                onClick={(e)=>changeLesson(lesson?.id)}
                                >
         
                                {lesson.title} 
                     
                        </li>
                    ))}
                </ul>
                
                <div className="flex justify-center">
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>

            </div>
        </div>
    );
}
