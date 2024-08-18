import { useNavigate, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import Navbar from "../components/Navbar";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import config from "../config/config";
import {
  createComment,
  deletePost,
  postComment,
  getPostById,
} from "../server/api";

export default function PostDetails() {
  const postId = useParams().id;
  const [post, setPost] = useState({});
  const user = useSelector((state) => state.user.user);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const fetchPost = async () => {
    try {
      const res = await getPostById(postId);
      setPost(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await deletePost(postId);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPostComments = async () => {
    setLoader(true);
    try {
      const res = await postComment(postId);
      setComments(res.data);
      setLoader(false);
    } catch (err) {
      setLoader(true);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPostComments();
  }, [postId]);

  const commentData = {
    comment: comment,
    author: user.username,
    postId: postId,
    userId: user._id,
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const res = await createComment(commentData);
      window.location.reload(true);
    } catch (err) {
      console.log(err);
    }
  };
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
            src={config.imagesUrl + post.photo}
            className="w-full  mx-auto mt-8"
            alt=""
          />
          <p className="mx-auto mt-8">{post.desc}</p>
          <div className="flex items-center mt-8 space-x-4 font-semibold">
            <p>Categories:</p>
            <div className="flex justify-center items-center space-x-2">
              {post.categories?.map((c, i) => (
                <>
                  <div key={i} className="bg-gray-300 rounded-lg px-3 py-1">
                    {c}
                  </div>
                </>
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
          <div className="w-full flex flex-col mt-4 md:flex-row">
            <input
              onChange={(e) => setComment(e.target.value)}
              type="text"
              placeholder="Write a comment"
              className="md:w-[80%] outline-none py-2 px-4 mt-4 md:mt-0"
            />
            <button
              onClick={handleAddComment}
              className="bg-black text-sm text-white px-2 py-2 md:w-[20%] mt-4 md:mt-0"
            >
              Add Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
