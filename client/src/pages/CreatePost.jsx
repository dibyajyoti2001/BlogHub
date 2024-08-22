import Navbar from "../components/Navbar";
import { ImCross } from "react-icons/im";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, upload } from "../server/api";
import { UserContext } from "../context/UserContext";

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    file: null,
    cat: "",
    cats: [],
  });
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const deleteCategory = (i) => {
    const updatedCats = [...formData.cats];
    updatedCats.splice(i, 1);
    setFormData({ ...formData, cats: updatedCats });
  };

  const addCategory = () => {
    const updatedCats = [...formData.cats, formData.cat];
    setFormData({ ...formData, cats: updatedCats, cat: "" });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const post = {
      title: formData.title,
      desc: formData.desc,
      username: user.username,
      userId: user._id,
      categories: formData.cats,
    };

    if (formData.file) {
      const data = new FormData();
      const filename = Date.now() + formData.file.name;
      data.append("photo", formData.file, filename);
      post.photo = filename;
      try {
        await upload(data);
      } catch (error) {
        alert(error.message);
      }
    }

    try {
      const res = await createPost(post);
      navigate("/posts/post/" + res.data.data._id);
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="px-6 md:px-[200px] mt-8">
        <h1 className="font-bold md:text-2xl text-xl ">Create a post</h1>
        <form className="w-full flex flex-col space-y-4 md:space-y-8 mt-4">
          <input
            name="title"
            onChange={handleInputChange}
            value={formData.title}
            type="text"
            placeholder="Enter post title"
            className="px-4 py-2 outline-none bg-slate-100 rounded w-96"
          />
          <input
            name="file"
            onChange={handleInputChange}
            type="file"
            className="px-4 rounded"
          />
          <div className="flex flex-col">
            <div className="flex items-center space-x-4 md:space-x-8">
              <input
                name="cat"
                value={formData.cat}
                onChange={handleInputChange}
                className="px-4 py-2 outline-none bg-slate-100 rounded w-96"
                placeholder="Enter post category"
                type="text"
              />
              <div
                onClick={addCategory}
                className="bg-black rounded text-white px-4 py-2 font-semibold cursor-pointer"
              >
                Add
              </div>
            </div>

            {/* categories */}
            <div className="flex px-4 mt-3">
              {formData.cats?.map((c, i) => (
                <div
                  key={i}
                  className="flex justify-center items-center space-x-2 mr-4 bg-slate-200 px-2 py-1 rounded-md"
                >
                  <p>{c}</p>
                  <p
                    onClick={() => deleteCategory(i)}
                    className="text-white bg-black rounded-full cursor-pointer p-1 text-sm"
                  >
                    <ImCross />
                  </p>
                </div>
              ))}
            </div>
          </div>
          <textarea
            name="desc"
            onChange={handleInputChange}
            value={formData.desc}
            rows={8}
            cols={15}
            className="px-4 py-2 outline-none bg-slate-100 rounded w-96"
            placeholder="Enter post description"
          />
          <button
            onClick={handleCreate}
            className="bg-black rounded w-full md:w-[20%] text-white font-semibold px-4 py-2 md:text-xl text-lg"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
