"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import 'react-calendar/dist/Calendar.css';
import '@/app/globals.css';
import { fetchMeeting } from "@/store/meetingSlice";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Meeting } from "@/store/meetingSlice";

const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

// interface Webinar {
//   id: number;
//   title: string;
//   date: string;
//   youtubeLink?: string;
//   zoomLink?: string;
//   description: string;
//   startTime: string;
//   endTime: string;
// }

// const mockWebinars: Webinar[] = [
//   {
//     id: 1,
//     title: "Вебинар: Основы кибербезопасности",
//     date: "2025-05-18",
//     startTime: "18:00",
//     endTime: "19:30",
//     youtubeLink: "https://youtube.com/live/abc123",
//     description: "Узнаем базовые принципы защиты информации.",
//   },
//   {
//     id: 2,
//     title: "DevOps практики в 2025",
//     date: "2025-05-24",
//     startTime: "17:00",
//     endTime: "18:15",
//     zoomLink: "https://zoom.us/j/1234567890",
//     description: "CI/CD, Docker и многое другое.",
//   },
//   {
//     id: 3,
//     title: "JS практики в 2025",
//     date: "2025-05-24",
//     startTime: "19:00",
//     endTime: "20:15",
//     zoomLink: "https://zoom.us/j/1234567890",
//     description: "CI/CD, Docker и многое другое.",
//   },
// ];

export default function WebinarCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedWebinars, setSelectedWebinars] = useState<Meeting[]>([]);

  const dispatch = useAppDispatch()

  const {meetings} = useSelector( (state:RootState) => state.meeting)

  useEffect(()=> {
    dispatch (fetchMeeting())
  },[dispatch])

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const formatted = date.toLocaleDateString("sv-SE");
    const found = meetings.filter(w => w.date === formatted);
    setSelectedWebinars(found);
  };

  const groupedWebinars = Object.entries(
    (meetings ?? []).reduce((acc, w) => {
      if (!acc[w.date]) acc[w.date] = [];
      acc[w.date].push(w);
      return acc;
    }, {} as Record<string, Meeting[]>)
  )
    // ✅ фильтрация на будущее или сегодняшнее число
    .filter(([date]) => {
      const webinarDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // убираем время
      return webinarDate >= today;
    })
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <>
    <div>
       {/* 👉 Dialog вынесен за пределы сетки */}
       {selectedWebinars.length > 0 && (
        <Dialog open onOpenChange={() => setSelectedWebinars([])}>
          <div className="bg-white p-6 rounded-xl shadow-xl mt-6 space-y-6 max-w-xl mx-auto">
            {selectedWebinars.map((webinar) => (
              <div key={webinar.id}>
                <h2 className="text-xl font-semibold mb-1">{webinar.title}</h2>
                <p className="text-gray-700 mb-1">{webinar.description}</p>
                <p className="text-sm text-gray-500 mb-3">
                  🕒 {webinar.startTime.slice(0, 5)} – {webinar.endTime.slice(0, 5)}
                </p>

                {webinar.youtubeLink && (
                  <a
                    href={webinar.youtubeLink}
                    target="_blank"
                    className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
                  >
                    Смотреть на YouTube
                  </a>
                )}

                {webinar.zoomLink && (
                  <a
                    href={webinar.zoomLink}
                    target="_blank"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Подключиться в Zoom
                  </a>
                )}
              </div>
            ))}
          </div>
        </Dialog>
      )}
      </div>

      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Календарь */}
        <div className="col-span-1">
          <h1 className="text-2xl font-bold mb-4">Календарь вебинаров</h1>
          <Calendar
            onClickDay={handleDateClick}
            tileClassName={({ date }) =>
              meetings?.some(
                (w) => w.date === date.toLocaleDateString("sv-SE")
              )
                ? "highlight-date"
                : undefined
            }
            tileDisabled={({ date }) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0); // обнулить время
              return date < today;
            }}
          />
        </div>

        {/* Список вебинаров */}
        <div className="col-span-2">
          <h2 className="text-xl font-semibold mb-4">Предстоящие вебинары</h2>
          {groupedWebinars.map(([date, items]) => (
            <div key={date} className="mb-6">
              <h3 className="text-md font-bold text-gray-800 mb-2">
                📅 {new Date(date).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <ul className="space-y-3">
                {items.map((webinar) => (
                  <li
                    key={webinar.id}
                    className="border rounded p-4 shadow-sm hover:shadow transition cursor-pointer"
                    onClick={() => setSelectedWebinars([webinar])}
                  >
                    <div className="text-lg font-medium">{webinar.title}</div>
                    <div className="text-sm text-gray-500">
                      🕒 {webinar.startTime.slice(0, 5)} – {webinar.endTime.slice(0, 5)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

     
    </>
  );
}
