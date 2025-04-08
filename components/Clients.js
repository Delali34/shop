import React from "react";
import { Users, Building2 } from "lucide-react";

export default function Clients() {
  return (
    <div
      className="min-h-screen font-luxury flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/clients.JPG')", // Update this path to your image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // This creates a parallax-like effect
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="w-full max-w-4xl p-8 relative z-10">
        <div className="backdrop-blur-sm rounded-xl shadow-2xl p-8 md:p-12 transform hover:scale-102 transition-transform duration-300">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent text-white">
            Our Clients
          </h1>
          <p className="text-center text-white">
            We deliver tailored solutions to clients spanning various industries
            and sectors. Our clientele comprises individuals, businesses, and
            organizations.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* <div className=" backdrop-blur-sm p-6 rounded-lg bg-white transition-colors duration-300">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Individuals
              </h2>
              <ul className="space-y-4">
                {[
                  "Fashion Conscious Professionals",
                  "Reverend Ministers and Pastors",
                  "Diplomats",
                  "Members of Parliament",
                  "Ministers of States",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className="hover:text-black transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* <div className="bg-white backdrop-blur-sm p-6 rounded-lg  transition-colors duration-300">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6" />
                Institutions
              </h2>
              <ul className="space-y-4">
                {[
                  "Banks",
                  "Hotels",
                  "Schools",
                  "Insurance Companies",
                  "Businesses",
                  "Fashion Retailers and Boutiques",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className="hover:text-black transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
