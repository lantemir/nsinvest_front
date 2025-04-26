"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import img253 from "@/src/images/253.jpeg"

interface Props {
  id: number;
  title: string;
  deadline: string;
  status: string;
  itemsCount: number;
}

const TenderCard: React.FC<Props> = ({ id, title, deadline, status, itemsCount }) => {
  return (
    <div className="border rounded-xl p-4 shadow-md hover:shadow-lg transition w-full md:w-[48%] lg:w-[32%]">
      <Link
        href={`/dashboard/requests/${id}`}
        
      >
      <Image
        src={img253}
        alt="Изображение тендера"
        className="rounded-md mb-2"
        width={400}
        height={200}
      />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-500">Срок: {deadline}</p>
      <p className="text-sm">Статус: <span className="font-medium">{status}</span></p>
      <p className="text-sm">Позиций: {itemsCount}</p>

      
     
      </Link>
    </div>
  );
};

export default TenderCard;
