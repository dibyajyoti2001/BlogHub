import config from "../config/config";

export default function HomePosts({ post }) {
  const imageUrl = config.imagesUrl;

  return (
    <div className="w-full flex mt-8 space-x-4">
      <div className="w-[35%] h-[200px] flex justify-center items-center">
        <img
          src={`${imageUrl}/${post.photo.split("\\").pop()}`}
          alt="photo"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col w-[65%]">
        <h1 className="text-xl font-bold md:mb-2 mb-1 md:text-2xl">
          {post.title}
        </h1>
        <div className="flex mb-2 text-sm font-semibold text-gray-500 items-center justify-between md:mb-4">
          <p>@{post.username}</p>
          <div className="flex space-x-2 text-sm">
            <p>{new Date(post.updatedAt).toString().slice(0, 15)}</p>
            <p>{new Date(post.updatedAt).toString().slice(16, 24)}</p>
          </div>
        </div>
        <p className="text-sm md:text-lg">
          {post.desc.slice(0, 200) + " ...Read more"}
        </p>
      </div>
    </div>
  );
}
