import Link from "next/link";
import React from "react";

const Content = () => {
  return (
    <div className="ms-auto mb-auto w-10/12 text-right text-neutral">
      <h1 className="text-5xl font-bold font-Lobster select-none">
        Culmination Point!
      </h1>
      <p className="text-2xl font-semibold font-Raleway my-10 select-none">
        Connect | Create | Celebrate
      </p>
      <p className="text-xl font-medium ms-auto w-6/12 my-6 select-none">
        Unite, express, and connect like never before.
        <br />
        <span className="font-thin italic font-Croissant">Ascendre</span>: Where
        university students spark their exceptional journey!
      </p>
      <button className="btn btn-ghost btn-outline border-0 text-xl shadow shadow-error hover:shadow-error-content hover:shadow-lg my-6 font-sans">
        <Link href={"/api/auth/signin"}>Join In </Link>
      </button>
    </div>
  );
};

export default Content;
