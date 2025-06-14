"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaQuoteLeft, FaTimes } from "react-icons/fa";

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeSection, setActiveSection] = useState("gallery");
  const [isSticky, setIsSticky] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Scroll to the top of the content area
    if (contentRef.current) {
      const yOffset = contentRef.current.offsetTop - 80; // Adjust for sticky header
      window.scrollTo({
        top: yOffset,
        behavior: "smooth",
      });
    }
  };

  const galleryItems = [
    {
      id: 1,
      image: "/gallery/gal (1).JPG",
      title: "Classic Silk Tie",
      description: "Hand-crafted pure silk tie in navy blue",
    },
    {
      id: 2,
      image: "/gallery/gal (1).PNG",
      title: "Evening Bow Tie",
      description: "Black satin bow tie",
    },
    {
      id: 3,
      image: "/gallery/gal (2).JPG",
      title: "Evening Bow Tie",
      description: "Black satin bow tie",
    },
    {
      id: 4,
      image: "/gal2.JPG",
      title: "Evening Bow Tie",
      description: "Black satin bow tie",
    },
    {
      id: 5,
      image: "/gal1.JPG",
      title: "Evening Bow Tie",
      description: "Black satin bow tie",
    },
    {
      id: 6,
      image: "/gallery/ga.PNG",
      title: "Evening Bow Tie",
      description: "Black satin bow tie",
    },
    {
      id: 7,
      image: "/gallery/gal (5).JPG",
      title: "Evening Bow Tie",
      description: "Black satin bow tie",
    },
    {
      id: 8,
      image: "/gallery/gal (6).JPG",
      title: "Evening Bow Tie",
      description: "Black satin bow tie",
    },
    {
      id: 9,
      image: "/gallery/gal (7).JPG",
      title: "Evening Bow Tie",
      description: "Black satin bow tie",
    },
    {
      id: 10,
      image: "/gallery/gal (8).JPG",
      title: "Evening Bow Tie",
      description: "Black satin bow tie",
    },
    {
      id: 11,
      image: "/gallery/gal5.PNG",
      title: "Evening Bow Tie",
      description: "Black satin bow tie",
    },
    {
      id: 12,
      image: "/gallery/gal9.jpg",
      title: "Evening Bow Tie",
      description: "Black satin bow tie",
    },
    {
      id: 13,
      image: "/gallery/gal10.JPG",
      title: "Evening Bow Tie",
      description: "Black satin bow tie",
    },
  ];

  const featuredClients = [
    {
      id: 1,
      name: "James Wilson",
      role: "CEO, Tech Industries",
      image: "/clients.JPG",
      testimonial:
        "The quality and craftsmanship of these ties are unmatched. I wear them to all my important meetings.",
    },
    {
      id: 2,
      name: "Robert Chen",
      role: "Investment Banker",
      image: "/clients.JPG",
      testimonial:
        "These ties have become my signature look. The attention to detail is remarkable.",
    },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen font-luxury">
      {/* Sticky Navigation */}
      <div
        className={`${
          isSticky
            ? "fixed top-50 left-0 right-0 bg-white shadow-md z-40"
            : "bg-white shadow-sm"
        } transition-all duration-300`}
      >
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="flex justify-center gap-8 py-4">
            {["gallery", "feature stories"].map((section) => (
              <button
                key={section}
                onClick={() => handleSectionChange(section)}
                className={`relative px-6 py-2 text-lg uppercase tracking-wider transition-all ${
                  activeSection === section
                    ? "text-black"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {section}
                {activeSection === section && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={contentRef} className="max-w-[1320px] mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {activeSection === "gallery" ? (
            <motion.div
              key="gallery"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-luxury mb-4">
                  Our Gallery
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover our exquisite collection of handcrafted ties, each
                  piece a testament to luxury and sophistication.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {galleryItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="group relative cursor-pointer"
                    onClick={() => setSelectedImage(item)}
                  >
                    <div className="relative h-[500px] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <FaSearch className="text-white text-3xl" />
                      </div>
                    </div>
                    {/* <div className="p-4 text-center">
                      <h3 className="text-xl font-luxury">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div> */}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="stories"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-luxury mb-4">
                  Feature Stories
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Meet some of our esteemed clients who trust us for their
                  professional appearance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredClients.map((client) => (
                  <motion.div
                    key={client.id}
                    variants={itemVariants}
                    className="bg-white p-6 rounded-lg shadow-lg"
                  >
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <Image
                        src={client.image}
                        alt={client.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <FaQuoteLeft className="text-gold text-2xl mb-4 mx-auto" />
                    <p className="text-gray-600 text-center mb-4">
                      {client.testimonial}
                    </p>
                    <h3 className="text-xl text-center font-luxury">
                      {client.name}
                    </h3>
                    <p className="text-gold text-center">{client.role}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimes />
            </button>
            <div className="relative w-full max-w-3xl h-[80vh]">
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
