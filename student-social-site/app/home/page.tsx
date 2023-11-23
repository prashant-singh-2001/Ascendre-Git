import React from "react";
import Layout from "../components/Layout";
import { Metadata } from "next";
import { User } from "./user";
import { Club } from "./clubs";
export const metadata: Metadata = {
  title: "Ascendre",
  description: "Student Social Site",
};
const page = async () => {
  return (
    <div className="font-Raleway w-screen min-h-screen flex flex-row justify-start overflow-hidden">
      <Layout>
        <div className="flex flex-row w-full h-full  gap-1 ">
          <div className="flex flex-wrap w-full xl:w-8/12 h-full  rounded overflow-y-scroll no-scrollbar">
            {/* <User /> */}
          </div>
          <div className="hidden xl:flex flex-wrap flex-row w-4/12 h-full  rounded border-l-8 border-l-gray-500 py-4 px-2 overflow-y-scroll no-scrollbar">
            <User />
            <hr className="border-2 border-primary-content w-full rounded-md  my-1" />
            <div className="h-full">
              <Club joined={true} />
              <Club joined={false} />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default page;
