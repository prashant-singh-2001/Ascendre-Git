"use client";

import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import { RxArrowTopLeft } from "react-icons/rx";
export const RegisterForm = () => {
  const [object, setObject] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [confirmPass, setConfirmPass] = useState(true);
  const confirm = classNames("w-full input input-bordered", {
    "border-error": !confirmPass,
  });
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/student/", {
        method: "POST",
        body: JSON.stringify({
          name: object.name,
          email: object.email,
          password: object.password,
          course: "MBBS",
          batch: 2023,
          banner: {
            public_id: "...",
            url: "...",
          },
          avatar: {
            public_id: "...",
            url: "...",
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        console.log("ok");
      } else {
        console.log(res);
        setError(JSON.stringify(res));
      }
    } catch (error: any) {
      setError(error.message);
    }
    console.log("onSubmit");
  };
  return (
    <div className="w-full p-6 m-auto mt-2 bg-base lg:max-w-xl">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold my-4 text-gray-700">
          Lets get started!
        </h1>
        <Link
          className="flex justify-center items-center text-md rounded-2xl p-2 my-2 text-gray-500  hover:text-gray-900"
          href={"/login"}
        >
          <RxArrowTopLeft />
          Log In
        </Link>
      </div>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <label className="label">
            <span className="text-base label-text">Name</span>
          </label>
          <input
            value={object.name}
            type="text"
            placeholder="Name"
            name="name"
            className="w-full input input-bordered"
            onChange={(e) => {
              setObject({ ...object, [e.target.name]: e.target.value });
            }}
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="text-base label-text">Email</span>
          </label>
          <input
            name="email"
            value={object.email}
            type="text"
            placeholder="Email Address"
            className="w-full input input-bordered"
            onChange={(e) => {
              setObject({ ...object, [e.target.name]: e.target.value });
            }}
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="text-base label-text">Password</span>
          </label>
          <input
            name="password"
            value={object.password}
            type="password"
            placeholder="Enter Password"
            className="w-full input input-bordered"
            onChange={(e) => {
              setObject({ ...object, [e.target.name]: e.target.value });
            }}
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="text-base label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            className={confirm}
            required
            onChange={(e) => {
              object.password === e.target.value
                ? setConfirmPass(true)
                : setConfirmPass(false);
            }}
          />
        </div>
        {error && (
          <span className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              onClick={() => {
                setError(null);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </span>
        )}
        <div>
          <button className="btn btn-block btn-accent btn-outline border-0 ">
            Sign Up
          </button>
        </div>
      </form>
      <div className="flex items-center w-full my-4">
        <hr className="w-full" />
        <p className="px-3 ">OR</p>
        <hr className="w-full" />
      </div>
      <div className="my-6 space-y-2">
        <button
          aria-label="Login with Google"
          type="button"
          className="flex items-center justify-center w-full p-2 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-5 h-5 fill-current"
          >
            <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
          </svg>
          <p>Login with Google</p>
        </button>
        <button
          aria-label="Login with GitHub"
          role="button"
          className="flex items-center justify-center w-full p-2 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-5 h-5 fill-current"
          >
            <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
          </svg>
          <p>Login with GitHub</p>
        </button>
      </div>
    </div>
  );
};
