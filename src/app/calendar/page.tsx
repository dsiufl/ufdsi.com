import ScrollUp from "@/components/Common/ScrollUp";
import { Calendar } from "@/components/Workshop/Calendar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events Calendar",
  description:
    "View all upcoming UF DSI workshops, networking events, and activities. Add our Google Calendar to never miss a data science or AI event at the University of Florida.",
  alternates: {
    canonical: "https://ufdsi.com/calendar",
  },
  openGraph: {
    title: "Events Calendar | UF DSI",
    description:
      "View all upcoming UF DSI workshops, networking events, and activities at the University of Florida.",
    url: "https://ufdsi.com/calendar",
  },
};

const CalendarPage = () => {
  return (
    <>
      <section
        id="calendar"
        className="relative z-10 overflow-hidden pb-0 "
      >
        <div className="container mx-auto">
          <div className="mx-auto max-w-[800px] text-center">
            <h1>
              Events Calendar
            </h1>
            <p className="text-lg leading-relaxed px-4 mb-6">
              View all upcoming DSI workshops, events, and activities. Add our calendar to your own to never miss an event!
            </p>
            <a
              href="https://calendar.google.com/calendar/u/0?cid=ZHNpdWZsQGdtYWlsLmNvbQ"
              target="_blank"
              rel="noopener noreferrer"
              className="button"
            >
              + Add to Google Calendar
            </a>
          </div>
        </div>
        <div className=" pt-10 pb-12 md:pt-16 md:pb-16 flex justify-center">
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
