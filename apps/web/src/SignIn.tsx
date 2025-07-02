import React from "react";
import { Link } from "react-router-dom";

const SignIn: React.FC = () => {
  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: 'url("/bg.jpg")' }}
    >
      <div className="px-4 py-8 md:p-10 sm:p-4 border border-black rounded-xl bg-black/50 shadow w-full sm:max-w-md md:max-w-md xl:max-w-xl">
        <div className="my-4 ">
          <Link
            to="/"
          >
            <h1 className="hidden xl:block text-center text-2xl md:text-4xl lg:text-5xl font-light text-white hover:text-blue-300 hover:underline cursor-pointer">
              inVoiceChain
            </h1>
          </Link>
          <hr className="hidden xl:block my-10 h-0.5 border-t-0 bg-gray-400/50" />
          <h1 className="text-center xl:text-4xl md:text-2xl font-light text-white mb-4">
            Sign In
          </h1>

          <div className="text-right">
            <a
              href="#"
              className="hidden xl:block text-gray-300 hover:text-blue-300 text-xs md:text-base underline font-medium"
            >
              Forgot password?
            </a>
          </div>
        </div>
        <form className="flex flex-col gap-y-4 md:gap-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-base"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs  md:text-base"
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition font-medium text-xs md:text-base"
          >
            Sign In
          </button>
          <span className="text-white text-xs md:text-base text-center">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-gray-300 hover:text-blue-300 hover:underline font-medium underline text-xs md:text-base"
            >
              Sign Up
            </Link>
          </span>
        </form>
      </div>
    </div >
  );
};

export default SignIn;
