"use client";

import { useState } from "react";
import Image from "next/image";

export default function ArticleHeroImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] bg-border aspect-[1200/630]">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-border" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
