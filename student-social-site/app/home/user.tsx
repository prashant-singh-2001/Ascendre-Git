import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
export const User = async () => {
  const session = await getServerSession(authOptions);
  var student = {
    avatar: {
      public_id: null,
      url: null,
    },
    banner: {
      public_id: null,
      url: null,
    },
    _id: null,
    name: null,
    email: null,
    password: null,
    batch: null,
    course: null,
    privacy: null,
    contact_number: null,
    role: null,
    friend: [],
    isDeleted: null,
    createdAt: null,
    __v: 0,
  };
  const date = new Date(
    session?.student?.batch &&
      JSON.stringify(session?.student?.batch).substring(1, 11)
  );
  student = session?.student;
  return (
    <div className="select-none flex flex-wrap justify-between items-center w-full h-2/12  hover:shadow-xl shadow-accent-content rounded-lg p-2 duration-300 text-base-content ">
      <div className="ms-2 w-2/12 h-full flex hover:shadow-md shadow-accent rounded-full justify-center items-center bg-base-200">
        <img
          src="/profile-placeholder.png"
          className="h-full w-full image-full border-0 "
        ></img>
      </div>
      <div className=" w-9/12 me-2 h-full flex p-2 gap-2 justify-between flex-wrap">
        <span className="text-md font-semibold">{student.name}</span>
        <span className="italic line-clamp-1">@{student.email} </span>
        <span>{student.contact_number}</span>
        <span>{student.course}</span>
        <span>{date.toDateString().substring(4, 15)}</span>
      </div>
    </div>
  );
};
