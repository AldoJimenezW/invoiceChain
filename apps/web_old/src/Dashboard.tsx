import React, { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";

// Dummy data
const recommended = [
  {
    id: 1,
    title: "Invoice Automation",
    desc: "Automate your invoice workflow easily.",
    img: "https://source.unsplash.com/random/300x200?invoice",
  },
  {
    id: 2,
    title: "Expense Tracker",
    desc: "Track expenses with real-time analytics.",
    img: "https://source.unsplash.com/random/300x200?finance",
  },
];

const bestRated = [
  {
    id: 1,
    title: "Smart Billing",
    desc: "AI-powered billing for your business.",
    img: "https://source.unsplash.com/random/300x200?ai",
  },
  {
    id: 2,
    title: "Secure Payments",
    desc: "Top-rated payment security features.",
    img: "https://source.unsplash.com/random/300x200?security",
  },
];

const Dashboard: React.FC = () => {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch //refetch the session
  } = authClient.useSession()
  console.log(session)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-blue-700 tracking-wide">
          in<span className="text-blue-500">Voice</span>Chain
        </div>
        <div className="flex-1 mx-8">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="flex items-center gap-6">
          <button className="text-gray-700 hover:text-blue-600 font-medium transition">Categories</button>
          <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition">
            <span className="inline-block w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">P</span>
            Profile
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="px-8 py-10">
        {/* Recommended Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* {recommended.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg flex overflow-hidden hover:shadow-2xl transition"
              >
                <img src={item.img} alt={item.title} className="w-40 object-cover" />
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-blue-700">{item.title}</h3>
                    <p className="text-gray-600 mt-2">{item.desc}</p>
                  </div>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition w-max">
                    Try Now
                  </button>
                </div>
              </div>
            ))} */}
            <div className="embla">
              <div className="embla__container">
                <div className="embla__slide">Slide 1</div>
                <div className="embla__slide">Slide 2</div>
                <div className="embla__slide">Slide 3</div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Rated Section */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Best Rated</h2>
          <div className="flex gap-6 overflow-x-auto pb-2">
            {bestRated.map((item) => (
              <div
                key={item.id}
                className="min-w-[260px] bg-gradient-to-tr from-blue-500 to-blue-300 rounded-2xl shadow-xl p-5 flex flex-col items-center text-white hover:scale-105 transition"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow mb-4"
                />
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-blue-100 text-sm mt-2 text-center">{item.desc}</p>
                <button className="mt-4 px-4 py-2 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-100 transition">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
