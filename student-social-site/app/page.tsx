import MainBody from "./components/HeroPage/MainBody";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Ascendre",
  description: "Student Social Site",
};
export default async function Home() {
  return (
    <div className="p-0">
      <MainBody />
    </div>
  );
}
