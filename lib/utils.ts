// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { mappings, interviewCovers } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

export const normalizeTechName = (tech: string): string => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings] || "default";
};

export const checkIconExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

export const getRandomInterviewCover = (): string => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};
