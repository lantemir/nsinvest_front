"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import img253 from "@/src/images/253.jpeg"

interface Props {
  id: number;
  title: string; 
  thumbnail: string | null; 
}

const CyberCard: React.FC<Props> = ({ id, title, thumbnail }) => {
    const imageUrl = thumbnail
    ? `http://localhost:8000${thumbnail}`
    : "/fallback-image.jpg"; // путь к запасной картинке в public/
    
  return (
    <div className="border rounded-xl p-4 shadow-md hover:shadow-lg transition w-full md:w-[48%] lg:w-[32%]">
      <Link
        href={`/dashboard/cybersecurity/components/lesson/${id}`}
        
      >
      <Image
        src={imageUrl}
        alt="Изображение тендера"
        className="rounded-md mb-2"
        width={400}
        height={200}
      />
      <h2 className="text-xl font-semibold">{title}</h2>      
      
     
      </Link>
    </div>
  );
};

export default CyberCard;