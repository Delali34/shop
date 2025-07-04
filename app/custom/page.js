"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const CustomLogoTies = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative font-luxury  ">
      <div className="relative h-[350px]">
        <motion.img
          src="/custom.JPG"
          alt="Custom Logo Ties"
          className="w-full h-full object-cover transform transition-transform duration-[8s] ease-in-out hover:scale-105"
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center lg:px-4">
          <motion.h1
            className="text-xl md:text-2xl lg:text-3xl font-bold mb-4"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Custom Logo Ties, Branded Scarves & Accessories
          </motion.h1>
          <motion.p
            className="text-sm md:text-lg lg:text-xl"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            We make it easy to create amazing branded accessories that match
            your brand.
          </motion.p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Custom Logo Ties
          </motion.h2>
          <motion.p
            className="text-lg mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            We create branded tie designs incorporating logo pattern repeats,
            single placements or full artwork prints with all the sizes needed
            to outfit a team. Custom tie tags are also available to add a brand
            statement or special message.
          </motion.p>
          <motion.a
            href=""
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md inline-block"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Custom Logo Ties
          </motion.a>
        </div>
        <div>
          <div>
            <motion.img
              src="/cus (1).JPG"
              alt="Custom Bow Tie"
              className="w-full h-full object-contain"
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariants}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <div>
              <motion.img
                src="/cus (2).JPG"
                alt="Custom Bow Tie"
                className="w-full h-full object-contain"
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariants}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </div>
            <div>
              <motion.img
                src="/cus.JPG"
                alt="Custom Bow Tie"
                className="w-full h-full object-contain"
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariants}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </div>
            <div>
              <motion.img
                src="/newit.jpg"
                alt="Custom Bow Tie"
                className="w-full h-full object-contain"
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariants}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Custom Logo Bow Ties
          </motion.h2>
          <motion.p
            className="text-lg mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Embrace uniqueness and creativity with pretied and self-tie logo bow
            tie options that help put the focus on your logo design instead of a
            poorly tied bow. Add a personalized touch by adding a special
            branded message on the strap.
          </motion.p>
          <motion.a
            href=""
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md inline-block"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Custom Bow Ties
          </motion.a>
        </div>
        <div>
          <motion.img
            src="/replace.jpeg"
            alt="Custom Bow Tie"
            className="w-full h-full object-cover"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Custom Logo Scarves
          </motion.h2>
          <motion.p
            className="text-lg mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Lightweight branded scarves work well all year round indoors and
            out, whether coordinating with matching ties or taking center stage
            and flying solo. Find a good fit for your team with a variety of
            sizes and styles to choose from.
          </motion.p>
          <motion.a
            href=""
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md inline-block"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Custom Scarves
          </motion.a>
        </div>
        <div>
          <motion.img
            src="/scar.JPG"
            alt="Custom Scarf"
            className="w-full h-full object-cover"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Custom Logo Pocket Squares
          </motion.h2>
          <motion.p
            className="text-lg mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Pair with logo ties or bow ties for an elevated brand statement or
            keep it classy with a simple branded pocket square peeking out from
            a jacket pocket.
          </motion.p>
          <motion.a
            href=""
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md inline-block"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Custom Pocket Squares
          </motion.a>
        </div>
        <div>
          <motion.img
            src="/IMG_3860.JPG"
            alt="Custom Pocket Square"
            className="w-full h-full object-cover"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </div>
      </div>
    </section>
  );
};

export default CustomLogoTies;
