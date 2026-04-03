"use client";

import { useState } from "react";
import Image from "next/image";

export default function ArticleHeroImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-border">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-border" />
      )}
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={630}
        loading="lazy"
        unoptimized
        onLoad={() => setLoaded(true)}
        className={`h-64 w-full object-cover transition-opacity duration-500 sm:h-80 md:h-96 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
