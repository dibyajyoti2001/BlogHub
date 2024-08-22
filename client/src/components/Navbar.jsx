import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import { useContext, useState } from "react";
import Menu from "./Menu";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const [searchQuery, setSearchQuery] = useState("");

  const showMenu = () => {
    setMenu(!menu);
  };

  const { user } = useContext(UserContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?title=${searchQuery}`);
      setSearchQuery("");
    } else {
      navigate("/");
    }
  };
  return (
    <div className="flex items-center justify-between px-6 md:px-[200px] py-4">
      <h1 className="text-lg md:text-xl font-extrabold">
        <Link to="/">Blog Hub</Link>
      </h1>
      {path === "/" && (
        <form
          onSubmit={handleSearch}
          className="flex justify-center items-center space-x-0 bg-slate-200 rounded-full px-5 py-2"
        >
          <button type="submit" className="cursor-pointer">
            <BsSearch />
          </button>
          <input
            className="outline-none px-3 bg-transparent"
            placeholder="Search a post"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      )}
      <div className="hidden md:flex items-center justify-center space-x-2 md:space-x-4">
        {user ? (
          <>
            <h3>
              <Link to="/">Home</Link>
            </h3>
            <h3>
              <Link to="/write">Write</Link>
            </h3>
          </>
        ) : (
          <h3>
            <Link to="/login">Login</Link>
          </h3>
        )}
        {user ? (
          <div onClick={showMenu}>
            <p className="cursor-pointer relative">
              <FaBars />
            </p>
            {menu && <Menu />}
          </div>
        ) : (
          <h3>
            <Link to="/register">Register</Link>
          </h3>
        )}
      </div>
      <div onClick={showMenu} className="md:hidden text-lg">
        <p className="cursor-pointer relative">
          <FaBars />
        </p>
        {menu && <Menu />}
      </div>
    </div>
  );
}
