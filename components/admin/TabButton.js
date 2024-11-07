export function TabButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 text-left ${
        active
          ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon
        className={`h-5 w-5 ${active ? "text-indigo-700" : "text-gray-400"}`}
      />
      <span className="ml-3 text-sm font-medium">{label}</span>
    </button>
  );
}
