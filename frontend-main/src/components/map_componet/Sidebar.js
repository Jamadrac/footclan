import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ setExpand, isExpand }) => {
  const toggleSidebar = () => {
    setExpand(!isExpand);
  };

  return (
    <div
      className={`bg-gray-800 text-white w-${
        isExpand ? "64" : "20"
      } transition-width duration-300 h-full`}
    >
      <button onClick={toggleSidebar} className="p-2 m-2">
        {isExpand ? "Collapse" : "Expand"}
      </button>
      <ul>
        <li>
          <NavLink
            to="/"
            className="block p-4 hover:bg-gray-700"
            activeClassName="bg-gray-900"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className="block p-4 hover:bg-gray-700"
            activeClassName="bg-gray-900"
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className="block p-4 hover:bg-gray-700"
            activeClassName="bg-gray-900"
          >
            Contact
          </NavLink>
        </li>
        {/* Add more navigation links as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;
