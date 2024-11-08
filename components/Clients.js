import React from "react";
import { Users, Building2 } from "lucide-react";

export default function Clients() {
  return (
    <div
      className="min-h-screen font-luxury flex items-center justify-center"
      style={{
        backgroundImage: "url('/')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-4xl p-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 transform hover:scale-102 transition-transform duration-300">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Our Clients
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Individuals Section */}
            <div className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300">
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
            </div>

            {/* Institutions Section */}
            <div className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300">
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
            </div>
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center space-x-4 mt-12">
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
