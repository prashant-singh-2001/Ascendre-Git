import Link from "next/link";

interface PostProp {
  _id: {
    $oid: string;
  };
  title: string;
  content: string;
  author: {
    $oid: string;
  };
  likes: [];
  image: [];
  comments: [
    {
      Author_ID: {
        $oid: string;
      };
      Author_Name: string;
      content: string;
      _id: {
        $oid: string;
      };
    },
    {
      Author_ID: {
        $oid: string;
      };
      Author_Name: string;
      content: string;
      _id: {
        $oid: string;
      };
    }
  ];
  createdAt: {
    $date: Date;
  };
  __v: 3;
  deletedDate: {
    $date: Date;
  };
  isDeleted: boolean;
  bannedDate: {
    $date: Date;
  };
  isBanned: boolean;
  isEdited: boolean;
  noOfComments: number;
  noOfLikes: number;
  club: {
    $oid: string;
  };
}
const PostCard = (prop: PostProp) => {
  // return (
  //   <div className="flex flex-wrap justify-between items-center bg-base-100 bg-opacity-40 hover:bg-opacity-80 hover:shadow-xl shadow-accent-content rounded-lg p-2 duration-300 text-base-content ">
  //     <div className="w-9/12 h-10 ">11</div>
  //     <div className="w-3/12 h-10 ">22</div>
  //   </div>
  // );
  const { title, content, author, createdAt, noOfLikes, noOfComments } = prop;

  return (
    <div className="flex flex-wrap justify-between items-center bg-base-100 bg-opacity-40 hover:bg-opacity-80 hover:shadow-xl shadow-accent-content rounded-lg p-2 duration-300 text-base-content">
      <div className="w.title);ll h-10">
        <h2 className="text-lg font-bold">{title}</h2>
        <p>{content}</p>
        <p>Author: {author.$oid}</p>
        <p>Created At: {createdAt.toLocaleString().substring(0, 10)}</p>
      </div>
      <div className="w-full h-40 flex flex-col justify-center items-center">
        <span>Likes: {noOfLikes}</span>
        <span>Comments: {noOfComments}</span>
      </div>
    </div>
  );
};

interface clubProps {
  _id: {
    $oid: string;
  };
  club_name: string;
  description: string;
  admin: { $oid: string };
  club_badge: {
    public_id: string;
    url: string;
  };
  banner: {
    public_id: string;
    url: string;
  };
  members: [string];
  report: string;
  isActive: boolean;
  created_on: {
    $date: Date;
  };
  isBanned: boolean;
  isjoined: boolean;
}
const ClubCard = (prop: clubProps) => {
  return (
    <div
      className={
        " w-full h-fit flex  flex-wrap justify-between items-center text-left border-2 border-transparent  rounded-lg  duration-300 text-base-content " +
        (prop.isjoined ? "  hover:border-success" : " hover:border-error")
      }
    >
      <Link href={`clubs/${prop._id}`} className=" flex h-full w-full">
        <div className="w-2/12 h-full p-2">
          <div className="rounded-xl p-0 overflow-clip">
            {prop.club_badge.url === "..." ? (
              <img
                src="/placeholder-round.png"
                className="image-full border-0 hover:scale-150 duration-500"
              ></img>
            ) : (
              <img
                src={prop.club_badge.url}
                className="h-full w-full image-full border-0 "
              ></img>
            )}
          </div>
        </div>

        <div className="w-7/12 h-full p-2 flex flex-row flex-wrap  items-center">
          <span className="text-xl w-8/12">{prop.club_name}</span>
          <span className="text-l w-full">
            Total members: {prop.members.length}
          </span>
        </div>
      </Link>
    </div>
  );
};
export { ClubCard, PostCard };
