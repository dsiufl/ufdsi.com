import ScrollUp from "@/components/Common/ScrollUp";
import { Calendar } from "@/components/Workshop/Calendar";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
  description: "View our upcoming workshops, events, and activities.",
};

const CalendarPage = () => {
  return (
    <>
      <section
        id="calendar"
        className="relative z-10 overflow-hidden pb-0 dark:bg-gray-900"
      >
        <div className="container mx-auto">
          <div className="mx-auto max-w-[800px] text-center mb-12">
            <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[45px]">
              Events Calendar
            </h1>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 px-4 mb-6">
              View all upcoming DSI workshops, events, and activities. Add our calendar to your own to never miss an event!
            </p>
            <a
              href="https://calendar.google.com/calendar/u/0?cid=ZHNpdWZsQGdtYWlsLmNvbQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-primary px-6 py-3 text-center text-base font-medium text-white transition-colors duration-300 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mb-8"
            >
              + Add to Google Calendar
            </a>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 pt-10 pb-12 md:pt-16 md:pb-16 flex justify-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="backdrop-blur-lg bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-xl p-6 md:p-10 border border-white/30 dark:border-gray-700/50 transition-all duration-300">
              <Calendar />
            </div>
          </div>
        </div>
      </section>
      <ScrollUp />
    </>
  );
};

export default CalendarPage;

