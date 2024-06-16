import { useContext, useState } from "react";
// import AuthContext from "../../context/AuthContext";
import webmarck from "../assets/webmarck_logo.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logoutUser } = useContext;

  return (
    <div
      id="nav"
      className={`px-4 shadow-md sticky flex top-0 z-50 md:px-8 bg-[#000000] bg-opacity-[90%] backdrop-blur-xl text-white flex-row w-full items-center justify-center ${
        open ? "blurred-background" : ""
      }`}
    >
      <nav className="flex w-full font-bold items-center py-4 md:py-6 justify-between">
        {/* Logo */}
        <Link
          to={"/"}
          className="w-10 h-10 rounded-full group border-4 border-indigo-600"
        >
          <img
            src={webmarck}
            alt="Webmarck Logo"
            className="object-cover rounded-full group-hover:scale-105 transition-all"
          />
        </Link>
        <div className=" font-extrabold ring-offset-yellow-300 text-3xl">
          WEBMARK
        </div>

        {user ? (
          // User is authenticated, display username
          <h5 className="text-4xl">{user.username}</h5>
        ) : (
          // User is not authenticated, display login message
          <div className="text-red">Locations</div>
        )}

        {/* Desktop Menu */}
        <div className="md:flex hidden flex-row gap-4">
          <div className="flex flex-row">
            <ul className="flex flex-row gap-4">
              <li>
                <a
                  className="ease-in-out transition-all duration-300 hover:text-indigo-400"
                  href="/"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  className="ease-in-out  transition-all duration-300 hover:text-indigo-400"
                  href="/Assets"
                >
                  fleet management
                </a>
              </li>
              <li>
                <a
                  className="ease-in-out border-black transition-all duration-300 hover:text-indigo-400"
                  href="/about"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  className="ease-in-out  transition-all duration-300 hover:text-indigo-400"
                  href="mailto:rabbikindal001@gmail.com"
                >
                  Help
                </a>
              </li>
            </ul>
          </div>

          {/* Access account button */}
          <div className="transition-all duration-300">
            <a
              href="/profile"
              className="bg-indigo-600 hover:text-gray-200 active:scale-95 transition-all text-white py-2 px-3 rounded-2xl"
            >
              Access your account
            </a>
          </div>
        </div>
        <div className="md:hidden block">
          <button onClick={() => setOpen(!open)} className="text-white">
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
        {/* Mobile Menu Content */}
        <motion.div
          animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: "100%" }}
          transition={{ duration: 0.1, delay: 0.2 }}
          className="md:hidden absolute top-[100%] bg-black bg-opacity-80 backdrop-blur-lg right-0 w-full text-center"
        >
          <ul className="text-white py-16 grid text-lg gap-3">
            <li>
              <a href="/" className=" hover:text-indigo-400">
                Services
              </a>
            </li>
            <li>
              <a href="/pricing" className=" hover:text-indigo-400">
                Pricing
              </a>
            </li>
            <li>
              <a href="/about" className=" hover:text-indigo-400">
                About Us
              </a>
            </li>
            <li>
              <a href="/" className=" hover:text-indigo-400">
                Help
              </a>
            </li>
            {user ? (
              <li>
                <button onClick={logoutUser}>Logout</button>
              </li>
            ) : (
              <li>
                <a href="/login">Login</a>
              </li>
            )}
          </ul>
        </motion.div>
      </nav>
    </div>
  );
};

export default Navbar;
