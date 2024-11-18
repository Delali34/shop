"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaCircleDot } from "react-icons/fa6";

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
    <div className="bg-gradient-to-br font-luxury  py-16 px-6 md:px-8">
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
              className="text-gold font-semibold text-2xl mb-4"
            >
              OUR SERVICES
            </motion.h3>
            <motion.h2
              variants={itemVariants}
              className="lg:text-3xl text-2xl md:text-3xl font-bold mb-8 text-gray-800 leading-tight"
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
                    <FaCircleDot className="text-gold" />
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
            <div className="relative w-full h-[400px]">
              <Image
                src="/tools.jpeg"
                alt="Professional styling"
                layout="fill"
                objectFit="contain"
                className="object-contain scale-105 mt-12 h-full w-full"
              />
              {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div> */}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Services;
