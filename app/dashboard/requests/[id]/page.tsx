"use client";
import { useParams } from "next/navigation";
import { mockTenders } from "@/src/data/tenders";
import Image from "next/image";
import img253 from "@/src/images/253.jpeg"

export default function TenderDetailsPage() {
  const { id } = useParams(); // получаем id из URL
  const tender = mockTenders.find((t) => t.id === Number(id));

  if (!tender) {
    return <div className="p-6">Тендер не найден</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{tender.title}</h1>

      <p><strong>Дата публикации на сайте:</strong> {tender.deadline}</p>
      <p><strong>Количество позиций:</strong> {tender.itemsCount}</p>
      <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg mt-4">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/DHjqpvDnNGE?si=XRexdMnBvxtkGopv"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      {/* здесь можно будет рендерить товары или предложения */}
      <div className="mt-6">
        <p className="text-gray-500 italic">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      </div>
      <div className=" w-full pb-[56.25%] h-0 overflow-hidden rounded-lg mt-4">
      <Image
        src={img253}
        alt="Изображение тендера"       
        width={900}
        height={200}
      />
      </div>
    </div>
  );
}