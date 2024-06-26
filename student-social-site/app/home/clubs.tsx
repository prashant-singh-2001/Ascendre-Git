import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { ClubCard } from "../components/Card";
import axios from "axios";
interface clubProps {
  _id: {
    $oid: string;
  };
  club_name: string;
  description: string;
  admin: {
    $oid: string;
  };
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
}
type prop = {
  joined: boolean;
};
export const Club = async ({ joined }: prop) => {
  const session = await getServerSession(authOptions);
  var clubs: Array<clubProps> = [];
  var unjoinedclubs: Array<clubProps> = [];
  if (joined) {
    await axios
      .post(
        "http://localhost:5000/api/v1/club/getStudentsClubs",
        { id: session?.student?._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        clubs = response.data.clubs;
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error fetching data:", error);
      });

    return (
      <div className="p-2 h-fit w-full">
        {clubs ? (
          clubs.map((club: clubProps) => {
            return (
              <div className="w-full h-full p-0" key={JSON.stringify(club._id)}>
                <ClubCard
                  key={JSON.stringify(club._id)}
                  {...club}
                  isjoined={joined}
                />
              </div>
            );
          })
        ) : (
          <div className="alert alert-error self-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error! Task failed successfully.</span>
          </div>
        )}
      </div>
    );
  } else {
    await axios
      .get("http://localhost:5000/api/v1/club/getClubs")
      .then((response) => {
        const data = response.data;
        unjoinedclubs = data.clubs;

        unjoinedclubs = unjoinedclubs.filter(
          (club) =>
            !club.members.some((member) => member === session?.student?._id)
        );
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error fetching data:", error);
      });

    return (
      <div className="p-2 h-fit w-full flex flex-col gap-2 items-center">
        {unjoinedclubs ? (
          unjoinedclubs.map((club: clubProps) => {
            return (
              <div className="w-full h-full p-0" key={club.club_name}>
                <ClubCard
                  key={JSON.stringify(club._id)}
                  {...club}
                  isjoined={joined}
                />
              </div>
            );
          })
        ) : (
          <div className="alert alert-error self-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error! Task failed successfully.</span>
          </div>
        )}
      </div>
    );
  }
};
