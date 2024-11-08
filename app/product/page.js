export default function Product() {
  return (
    <div
      className="min-h-screen font-luxury flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200"
      style={{
        backgroundImage: "url('/opulence (5).jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-center p-8 bg-white rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-black mb-4">
          Coming Soon
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-6">
          We're working hard to bring you something amazing!
        </p>
        <div className="flex justify-center space-x-4">
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}
