import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email(
        {
          email: email,
          password: password,
          rememberMe: true
        },
        {
          onRequest: (ctx) => {
            console.log("Sign up request:", ctx);
            // Optionally show loading
          },
          onSuccess: (ctx) => {
            console.log("Sign up success:", ctx);
            // navigate("/dashboard");
          },
          onError: (ctx) => {
            alert(ctx.error.message);
          },
        }
      );
      if (!error) {
        console.log(data);
      }
    } catch (err: any) {
      alert(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: 'url("/bg.jpg")' }}
    >
      <div className="px-4 py-8 md:p-10 sm:p-4 border border-black rounded-xl bg-black/50 shadow w-1/2 sm:w-full sm:max-w-sm md:max-w-md xl:max-w-2xl">
        <div className="my-4">
          <Link to="/">
            <h1 className="hidden xl:block text-center text-5xl font-light text-white hover:text-blue-300 hover:underline cursor-pointer">
              inVoiceChain
            </h1>
          </Link>
          <hr className="hidden xl:block my-8 h-0.5 border-t-0 bg-gray-400/50" />
          <h1 className="text-center md:text-4xl font-light text-white xl:mb-8 md:mb-8">
            Sign In
          </h1>
        </div>
        <form className="flex flex-col gap-y-4 md:gap-y-6" onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-base sm:pr-14"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="hidden sm:block absolute inset-y-0 right-2 flex items-center text-xs md:text-base text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition font-medium text-xs md:text-base"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
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
    </div>
  );
};

export default SignIn;
