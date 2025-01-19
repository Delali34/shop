"use client";
import React from "react";
import Image from "@/components/Image";
import Services from "@/components/Service";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Clients from "@/components/Clients";

const NecktieShape = ({ className, color }) => (
  <svg
    className={className}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M25 5 L35 15 L25 45 L15 15 Z"
      stroke={color}
      strokeWidth="2"
      fill={color}
      fillOpacity="0.1"
    />
  </svg>
);

const MessageComponent = () => {
  const tieColors = [
    "#2C3E50",
    "#E74C3C",
    "#3498DB",
    "#27AE60",
    "#F39C12",
    "#8E44AD",
  ];

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className=" relative overflow-hidden pt-16">
      <Image />
      {/* <div className="max-w-4xl py-10 font-luxury mx-auto px-4 text-center relative z-10">
        <motion.h1
          className="md:text-4xl lg:text-5xl text-3xl mb-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Opulence Accessories
        </motion.h1>
        <motion.p
          className="text-lg mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          A premium necktie and accessories manufacturing business, catering to
          fashion-conscious professionals and businesses. . Our expertise lies
          in crafting custom-made neckties and complementary accessories,
          catering
        </motion.p>
      </div> */}

      <Services />
      <Clients />
    </section>
  );
};

export default MessageComponent;
