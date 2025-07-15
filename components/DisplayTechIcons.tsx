"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import type { TechIconProps } from "@/types";

const DisplayTechIcons: React.FC<TechIconProps> = ({ techStack }) => {
  const [icons, setIcons] = useState<{ tech: string; url: string }[]>([]);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await fetch("/api/tech-logos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ techStack }),
        });

        const result = await response.json();

        if (!response.ok)
          throw new Error(result.error || "Failed to fetch tech logos");

        setIcons(result);
      } catch (error) {
        console.error("Error fetching tech logos:", error);
        setIcons([]);
      }
    };

    fetchIcons();
  }, [techStack]);

  return (
    <div className="flex gap-2">
      {icons.slice(0, 3).map((icon) => (
        <div
          key={icon.tech}
          className="relative group bg-dark-300 rounded-full flex items-center justify-center"
        >
          <span className="tech-tooltip absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 hidden group-hover:block">
            {icon.tech}
          </span>
          <Image
            src={icon.url}
            alt={icon.tech}
            width={20}
            height={20}
            className="size-5"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;