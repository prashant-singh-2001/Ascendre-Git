import { Metadata } from "next";
import Layout from "../components/Layout";
export const metadata: Metadata = {
  title: "Ascendre",
  description: "Student Social Site",
};
const page = async () => {
  return (
    <div className="font-Raleway w-screen min-h-screen flex flex-row justify-start overflow-hidden">
      <Layout>asd</Layout>
    </div>
  );
};
export default page;
