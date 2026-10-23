"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/** 프로필 사진. 사진이 없거나 불러오지 못하면 이름 첫 글자 모노그램을 보여줍니다 (D-09). */
export function ProfilePhoto({
  className,
  sizes,
  priority = false,
}: {
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const photo = site.hero.photo;

  return (
    <div className={cn("relative aspect-[4/5] overflow-hidden rounded-[28px]", className)}>
      {photo && !failed ? (
        <Image
          src={photo}
          alt={site.hero.photoAlt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-sky"
          role="img"
          aria-label={site.hero.photoAlt}
        >
          <span aria-hidden className="text-[clamp(56px,16vw,120px)] font-extrabold text-navy/80">
            {site.hero.monogram}
          </span>
        </div>
      )}
    </div>
  );
}
