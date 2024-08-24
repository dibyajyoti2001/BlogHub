import { useNavigate, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import Navbar from "../components/Navbar";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import config from "../config/config";
import {
  createComment,
  deletePost,
  postComment,
  getPostById,
} from "../server/api";
import { UserContext } from "../context/UserContext";

export default function PostDetails() {
  const imageUrl = config.imagesUrl;
  const postId = useParams().id;
  const [post, setPost] = useState({});
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const fetchPost = async () => {
    try {
      const res = await getPostById(postId);
      setPost(res.data.data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(postId);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchPostComments = async () => {
    setLoader(true);
    try {
      const res = await postComment(postId);
      setComments(res.data.data);
      setLoader(false);
    } catch (error) {
      setLoader(true);
      alert(error.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    const commentData = {
      comment: comment,
      author: user.username,
      postId: postId,
      userId: user._id,
    };

    try {
      await createComment(commentData);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchPostComments();
  }, [postId]);
  return (
    <div>
      <Navbar />
      {loader ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        <div className="px-8 md:px-[200px] mt-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black md:text-3xl">
              {post.title}
            </h1>
            {user?._id === post?.userId && (
              <div className="flex items-center justify-center space-x-2">
                <p
                  className="cursor-pointer"
                  onClick={() => navigate("/edit/" + postId)}
                >
                  <BiEdit />
                </p>
                <p className="cursor-pointer" onClick={handleDeletePost}>
                  <MdDelete />
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 md:mt-4">
            <p>@{post.username}</p>
            <div className="flex space-x-2">
              <p>{new Date(post.updatedAt).toString().slice(0, 15)}</p>
              <p>{new Date(post.updatedAt).toString().slice(16, 24)}</p>
            </div>
          </div>
          <img
            src={
              post.photo ? `${imageUrl}/${post.photo.split("\\").pop()}` : null
            }
            className="w-full  mx-auto mt-8"
            alt="photo"
          />
          <p className="mx-auto mt-8">{post.desc}</p>
          <div className="flex items-center mt-8 space-x-4 font-semibold">
            <p>Categories:</p>
            <div className="flex justify-center items-center space-x-2">
              {post.categories?.map((c) => (
                <div key={c} className="bg-slate-200 rounded-lg px-3 py-1">
                  {c}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <h3 className="mt-6 mb-4 font-semibold">Comments:</h3>
            {comments?.map((c) => (
              <Comment key={c._id} c={c} post={post} />
            ))}
          </div>
          {/* write a comment */}
          <div className="w-full mb-5 flex flex-col mt-4 md:flex-row">
            <input
              onChange={(e) => setComment(e.target.value)}
              type="text"
              placeholder="Write a comment"
              className="md:w-[80%] outline-none py-2 px-4 mt-4 md:mt-0 mr-5 bg-slate-100 rounded"
            />
            <button
              onClick={() => {
                navigate(`/posts/post/${post._id}`);
                handleAddComment();
              }}
              className="bg-black text-sm rounded text-white px-2 py-2 md:w-[20%] mt-4 md:mt-0"
            >
              Add Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
