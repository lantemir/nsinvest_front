"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchLessonsByCourse, fetchLessonById } from "@/store/lessonSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import clsx from "clsx";
import Link from "next/link";

export default function LessonPage() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    //const { lessons } = useSelector((state: RootState) => state.lesson);
    const { currentLesson, lessons } = useSelector((state: RootState) => state.lesson);

    useEffect(() => {
        // dispatch(fetchLessonsByCourse({ courseId: Number(id), page: 1 }));
        dispatch(fetchLessonById({ lessonId: Number(id) }))
    }, [dispatch, id]);

    useEffect(()=> {
        if(currentLesson?.course){
            dispatch(fetchLessonsByCourse({courseId: currentLesson?.course, page: 1}))
        }
    }, [dispatch, currentLesson?.course])

    return (
        <div className="flex flex-col lg:flex-row p-4 gap-6">
            {/* Основной контент */ }
            <div className="flex-1">
                {currentLesson && (
                    <div key={currentLesson.id} className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>

                        <div
                            className="prose max-w-none text-gray-800 mb-4"
                            dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                        />

                        {currentLesson.video && <div className="w-full max-w-3xl aspect-video overflow-hidden rounded-lg shadow-md mx-auto [&_iframe]:w-full [&_iframe]:h-full">
                            <div
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ __html: currentLesson.video }}
                            />
                        </div>
                        }
                    </div>
                )}
            </div>

            {/* Сайдбар с уроками */}
            <div className="w-full lg:w-32 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6 max-h-[300px] lg:max-h-[80vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-3">Уроки</h2>
                <ul className="space-y-2">
                    {lessons.map((lesson) => (
                        <li key={lesson.id}>
                            <Link
                                href={`/dashboard/cybersecurity/components/lesson/${lesson.id}`}


                                className={clsx(
                                    "text-left w-full",
                                    lesson.id === currentLesson?.id
                                        ? "text-gray-800 font-bold underline"
                                        : "text-gray-600 hover:underline"
                                )}
                            >
                                {lesson.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
