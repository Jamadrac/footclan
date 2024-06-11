import React, { useState } from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="absolute left-4 top-4 z-10 rounded-full bg-white p-4 shadow-lg"
      >
        <svg fill="none" viewBox="0 0 24 24" height="1em" width="1em">
          <path
            fill="currentColor"
            d="M22 18.005c0 .55-.446.995-.995.995h-8.01a.995.995 0 010-1.99h8.01c.55 0 .995.445.995.995zM22 12c0 .55-.446.995-.995.995H2.995a.995.995 0 110-1.99h18.01c.55 0 .995.446.995.995zM21.005 6.99a.995.995 0 000-1.99H8.995a.995.995 0 100 1.99h12.01z"
          />
        </svg>
      </button>
      <div
        className={`w-full flex justify-between absolute inset-0 duration-500 delay-200 z-20 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className={`flex flex-col w-1/4 bg-white p-4 shadow-lg`}>
          <Link to={"/"}>Profile</Link>
          <Link to={"/"}>XXX</Link>
          <Link to={"/"}>XXXxxx</Link>
          <Link to={"/"}>XXXx</Link>
          <Link to={"/"}>XXX XXX</Link>
        </nav>
        <button
          className={`flex-1 bg-black/25 w-full duration-700 delay-500 min-h-screen ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
      </div>
    </div>
  );
};

export default SideBar;
