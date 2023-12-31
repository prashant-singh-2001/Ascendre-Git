import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { PostCard } from "../components/Card";
import axios from "axios";

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

const Posts = async () => {
  const session = await getServerSession(authOptions);
  var ps: Array<PostProp> = [];
  await axios
    .get("http://localhost:5000/api/v1/post/")
    .then((response) => {
      ps = response.data.posts;
      console.log(ps[0].createdAt);
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error fetching data:", error);
    });
  return (
    <>
      {ps.length !== 0 ? (
        ps.map((post) => {
          return (
            <div key={post._id.$oid} className="flex flex-col w-full h-full">
              <PostCard {...post}></PostCard>
            </div>
          );
        })
      ) : (
        <div>OH NO</div>
      )}
    </>
  );
};

export default Posts;
