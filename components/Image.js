"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaImage,
} from "react-icons/fa";

const TeamMember = ({ member }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className=" overflow-hidden group"
  >
    <div className="relative overflow-hidden">
      {member.image ? (
        <Image
          src={member.image}
          alt={member.name}
          width={500}
          height={500}
          className="w-full h-[500px] object-contain transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder.png";
          }}
        />
      ) : (
        <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
          <FaImage className="text-gray-400 text-4xl" />
        </div>
      )}
      <div className="absolute   inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex gap-4 justify-center">
            {member.socials.map((social, index) => (
              <Link
                key={index}
                href={social.link}
                className="text-white hover:text-gray-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="py-6">
      <h3 className="text-lg uppercase text-center tracking-wider mb-2 font-luxury">
        {member.name}
      </h3>
      <p className="text-gold text-center font-medium mb-2">{member.role}</p>
      <p className="text-gray-600 text-center text-sm">{member.description}</p>
    </div>
  </motion.div>
);

const Team = () => {
  const teamMembers = [
    {
      image: "/Derrick.jpg",
      name: "Derick",
      role: "Founder & CEO",
      description: "",
      socials: [
        {
          icon: <FaFacebookF className="text-xl" />,
          link: "https://www.facebook.com/share/15ZYkXAugs/?mibextid=LQQJ4d",
        },
        {
          icon: <FaInstagram className="text-xl" />,
          link: "https://www.instagram.com/ehla_derick?igsh=ZHZzcng2ZTVrZmM%3D&utm_source=qr",
        },
      ],
    },
    {
      image: "/prince2.jpg",
      name: "Prince Kelly",
      role: "Business Development Manager",
      description: "",
      socials: [
        {
          icon: <FaLinkedinIn className="text-xl" />,
          link: "http://linkedin.com/in/prince-kelly-anyomitse",
        },
      ],
    },
    {
      image: "/nana.JPEG",
      name: "Nana Yaw Boahene",
      role: "Business Partner",
      description: "",
      socials: [
        { icon: <FaFacebookF className="text-xl" />, link: "#" },
        { icon: <FaInstagram className="text-xl" />, link: "#" },
        { icon: <FaTwitter className="text-xl" />, link: "#" },
      ],
    },
  ];

  return (
    <div className="min-h-screen font-luxury font-medium ">
      <div className="max-w-[1320px] mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-luxury mb-4">
            Meet Our Team
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our talented team of professionals brings together years of
            experience in fashion design, tailoring, and luxury craftsmanship.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {teamMembers.map((member, index) => (
              <TeamMember key={index} member={member} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Team;
