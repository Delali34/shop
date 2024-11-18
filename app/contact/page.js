import React from "react";
import { Phone, Instagram, Mail, Facebook } from "lucide-react";

export default function Contact() {
  return (
    <div
      className="min-h-screen font-luxury flex items-center justify-center"
      style={{
        backgroundImage: "url('/clients.JPG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-4xl p-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 transform hover:scale-102 transition-transform duration-300">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Get in Touch
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* WhatsApp Section */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Phone className="w-6 h-6" />
                  WhatsApp
                </h2>
                <div className="space-y-2">
                  <a
                    href="https://wa.me/233241448340"
                    className="block text-gray-700 hover:text-black transition-colors"
                  >
                    +233 241 448 340
                  </a>
                  <a
                    href="https://wa.me/233595008581"
                    className="block text-gray-700 hover:text-black transition-colors"
                  >
                    +233 595 008 581
                  </a>
                </div>
              </div>

              {/* Instagram Section */}
              <div className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Instagram className="w-6 h-6" />
                  Instagram
                </h2>
                <a
                  href="https://instagram.com/opulence_ties"
                  className="text-gray-700 hover:text-black transition-colors"
                  target="_blank"
                >
                  @opulence_ties
                </a>
              </div>

              {/* Facebook Section */}
              <div className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Facebook className="w-6 h-6" />
                  Facebook
                </h2>
                <a
                  href="https://facebook.com/opulenceties"
                  className="text-gray-700 hover:text-black transition-colors"
                  target="_blank"
                >
                  @opulenceties
                </a>
              </div>
            </div>

            {/* Email Section */}
            <div className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 h-fit">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6" />
                Email
              </h2>
              <a
                href="mailto:Opulenceties@gmail.com"
                className="text-gray-700 hover:text-black transition-colors"
              >
                Support@opulenceties.com
              </a>
            </div>
          </div>

          {/* Animated Dots */}
        </div>
      </div>
    </div>
  );
}
