import Link from "next/link";

interface postProps {}
const PostCard = () => {
  return (
    <div className="flex flex-wrap justify-between items-center bg-base-100 bg-opacity-40 hover:bg-opacity-80 hover:shadow-xl shadow-accent-content rounded-lg p-2 duration-300 text-base-content ">
      <div className="w-9/12 h-10 "></div>
      <div className="w-3/12 h-10 "></div>
    </div>
  );
};
interface clubProps {
  _id: {
    $oid: string;
  };
  club_name: string;
  description: string;
  admin: string;
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
        " w-full h-fit flex  flex-wrap justify-between items-center text-left   hover:shadow-xl  rounded-lg  duration-300 text-base-content  gap-2" +
        (prop.isjoined
          ? " hover:shadow-success hover:border hover:border-success"
          : " hover:shadow-error hover:border hover:border-error")
      }
    >
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

      <div className="w-9/12 h-full p-2 flex flex-row flex-wrap">
        <span className="text-xl w-8/12">{prop.club_name}</span>
        <span className="text-xl w-4/12">
          <Link href={`/clubs/${prop._id}`}>Go to club!</Link>
        </span>
        <span className="text- w-full">
          Total members: {prop.members.length}
        </span>
      </div>
    </div>
  );
};
export { ClubCard, PostCard };
