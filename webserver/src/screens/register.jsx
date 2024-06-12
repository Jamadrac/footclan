import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",
    profile: "", // Leaving profile blank
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/register",
        userData
      );

      console.log("User registered successfully:", response.data);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up for an account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <input
            type="text"
            name="username"
            id="username"
            autoComplete="username"
            required
            className="..."
            placeholder="Username"
            value={userData.username}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="new-password"
            required
            className="..."
            placeholder="Password"
            value={userData.password}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            required
            className="..."
            placeholder="Email address"
            value={userData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="firstName"
            id="firstName"
            autoComplete="given-name"
            required
            className="..."
            placeholder="First Name"
            value={userData.firstName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            id="lastName"
            autoComplete="family-name"
            required
            className="..."
            placeholder="Last Name"
            value={userData.lastName}
            onChange={handleInputChange}
          />
          <input
            type="tel"
            name="mobile"
            id="mobile"
            autoComplete="tel"
            required
            className="..."
            placeholder="Mobile"
            value={userData.mobile}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="address"
            id="address"
            autoComplete="street-address"
            required
            className="..."
            placeholder="Address"
            value={userData.address}
            onChange={handleInputChange}
          />
          <div>
            <button type="submit" className="...">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
