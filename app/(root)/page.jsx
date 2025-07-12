import React from "react";
import Link from "next/link";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/InterviewCard";




const Page = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="card-cta flex flex-col lg:flex-row justify-between items-center p-8 gap-10">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-3xl font-bold">
            Crack Interview with AI-Powered Practice & Feedback
          </h2>

          <p className="text-lg">
            Practice real interview problems and get instant feedback!!
          </p>

          <Link
            href="/interview"
            className="btn-primary max-sm:w-full text-center px-6 py-2 rounded bg-blue-600 hover:bg-amber-300 transition text-white font-semibold"
          >
            Start an Interview
          </Link>
        </div>

        <img
          src="/robot.png" alt="robo-dude" width={400} height={400}
          className="max-sm:hidden"
        />
      </section>
      

      {/* Interview History Section */}
<section className="flex flex-col gap-6 mt-12 px-8">
  <h2 className="text-2xl font-semibold">Your Interviews</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {dummyInterviews.map((interview) => (
      <InterviewCard key={interview.id} {...interview} />
    ))}
  </div>
</section>

{/* Take an Interview Section */}
<section className="flex flex-col gap-6 mt-12 px-8"> {/* mt-12 instead of mt-8 */}
  <h2 className="text-2xl font-semibold">Take an Interview!</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {dummyInterviews.length > 0 ? (
      dummyInterviews.map((interview) => (
        <InterviewCard key={interview.id} {...interview} />
      ))
    ) : (
      <p className="text-gray-500">There are no interviews available</p>
    )}
  </div>
</section>
    </>
  );
};

export default Page;
