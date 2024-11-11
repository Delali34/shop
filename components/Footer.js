// components/Footer.js
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black font-luxury font-medium text-white py-10">
      <div className="max-w-[1380px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Our Store */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Our Store</h5>
            <ul>
              <li className="mb-2 font-bold">Ghana</li>
              <li className="mb-2">15 Baussino Street Lashibi Community 18.</li>

              <li className="mb-2">Phone: +233241448340 / 0595008581</li>
            </ul>
            <ul>
              <li className="font-bold">USA</li>
              <li className="mb-2">
                1 remsen road apt 4k Yonkers 10710 NY Yonkers, NY 10710
              </li>

              <li className="mb-2">Phone: +1 (914) 267-7187</li>
              <li className="mb-2">Email: Support@opulenceties.com</li>
            </ul>
          </div>

          {/* Outfits */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Outfits</h5>
            <ul>
              <li className="mb-2">
                <a href="/categories" className="hover:underline">
                  Top Collection
                </a>
              </li>

              <li className="mb-2">
                <a href="/categories" className="hover:underline">
                  Featured Collection
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Legal</h5>
            <ul>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Privacy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 text-center text-gray-400">
          <p>© 2024 Opulence</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a
              href="https://instagram.com/opulence_ties"
              className="hover:text-white"
              target="_blank"
            >
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-white">
              <FaTwitter />
            </a>

            <a href="#" className="hover:text-white">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
