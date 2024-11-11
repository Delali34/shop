"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Services = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const services = [
    "Provide personalized or Custom-made designs for individuals and businesses.",
    "Provide Professional styling services that enhances the image of clients significantly.",
    "Assist client with wardrobe organization and update, shopping guidance, and personal color analysis. Provide Personal Image consulting.",
    "Provide Corporate Fashion advice that best reflect client budget, lifestyle, body shape and coloring.",
  ];

  return (
    <div className="bg-gradient-to-br font-luxury from-[#FFF1E6] to-[#FFE4D6] py-16 px-4 md:px-8">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            className="w-full lg:w-1/2 lg:pr-16 mb-12 lg:mb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h3
              variants={itemVariants}
              className="text-[#E7816B] font-semibold text-lg mb-4"
            >
              OUR SERVICES
            </motion.h3>
            <motion.h2
              variants={itemVariants}
              className="lg:text-4xl text-3xl md:text-5xl font-bold mb-8 text-gray-800 leading-tight"
            >
              Beyond delivering top-notch neckties and accessories we:
            </motion.h2>
            <motion.div variants={containerVariants} className="space-y-6">
              {services.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  variants={itemVariants}
                >
                  <span className="mr-4 mt-1 flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-[#E7816B]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </span>
                  <span className="text-gray-700">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/opulence (1).jpeg"
                alt="Professional styling"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Services;
