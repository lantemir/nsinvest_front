"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
// import { mockTenders } from "@/src/data/tenders";
import Image from "next/image";
import img253 from "@/src/images/253.jpeg"
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { fetchInterestingById } from "@/store/mainSlice";
import { RootState } from "@/store/store";
import { BASE_URL } from "@/src/config";


export default function InteresingPage() {
  const { id } = useParams(); // получаем id из URL

  const dispatch = useAppDispatch();
  const { interest } = useSelector((state: RootState) => state.interesting);

  const processedContent = interest?.content.replace(
    /src="\/media\//g,
    `src="${BASE_URL}/media/`
  );

  useEffect(() => {
    dispatch(fetchInterestingById({ id: Number(id) }));

  }, [dispatch, id]);

  return (
    <div className="p-6">     
      {interest && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{interest.title}</h2>
          <div
            className="prose max-w-none text-gray-800 mb-16"
            dangerouslySetInnerHTML={{ __html: processedContent || "" }}
          />
           <div className="w-full max-w-3xl  aspect-video overflow-hidden rounded-lg shadow-md mx-auto [&_iframe]:w-full [&_iframe]:h-full">
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: interest.video }}
            />
          </div>
          
        </div>
      )}
    </div>
  );
}