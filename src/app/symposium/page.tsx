import SymposiumSchedule from '@/components/symposium/index';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Symposium",
  description: "Symposium",
};

export default function SymposiumPage() {
  return <SymposiumSchedule />;
}