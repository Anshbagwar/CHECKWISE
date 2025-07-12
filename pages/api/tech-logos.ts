import type { NextApiRequest, NextApiResponse } from "next";
import { normalizeTechName, checkIconExists, techIconBaseURL } from "@/lib/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { techStack } = req.body;

    if (!Array.isArray(techStack)) {
      return res.status(400).json({ error: "techStack must be an array" });
    }

    const logoURLs = techStack.map((tech: string) => {
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

    res.status(200).json(results);
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
