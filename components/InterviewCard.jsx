import React from "react";
import dayjs from "dayjs";
import { getRandomInterviewCover } from "@/lib/utils";
import Link from "next/link";
import DisplaytTechIcons from "@/components/DisplayTechIcons";




const InterviewCard = ({ interviewId, userId, role, type, techstack, createdAt }) => {
  const feedback = null;
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
    <div className="card-interview">
        <div>
            <div className="absolute top-0 right-0 w-fit px-4 py-3 
            rounded-bl-lg bg-light-600">
                <p className="badge-text">{normalizedType}</p>
            </div>
            <img src={getRandomInterviewCover()} alt="cover image" width={70} height={70}
            className="rounded-full object-fit size-[90px]"></img>
            <h3 className="mt-5 capitalize">
              {role} Interview
            </h3>
            <div className="flex flex-row gap-5 mt-3">
              <div className="flex flex-row gap-2">
                <img src="/calendar.svg" alt="calendar" width={22} height={22}></img>
                <p>{formattedDate}</p>
              </div>
              <div className="flex fle-row gap-2 items-center">
                <img src="/star.svg" alt="star" width={22} height={22}></img>
                <p>{feedback?.totalScore ? `${feedback.totalScore}/100` : "---"}</p>

              </div>
            </div>
            <div>
              <p className="line-clamp-2 mt-5">
                {feedback?.finalAssessment || "You have not taken an interview yet. Take it now to improve yourself."};
              </p>
            </div>
            <div className="flex flex-row justify-between mt-4 items-center">
              <DisplaytTechIcons techStack={techstack}/>
            
            <Link href={feedback ? `/interview/${interviewId}/feedback` : `/interview/${interviewId}`}
            className="btn-primary"> {feedback ? "Check Feedback" : "View"}</Link>
            </div>
            </div>
    </div>
    </div>
  );
};

export default InterviewCard;
