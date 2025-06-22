
const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-6">
      <div className="flex space-x-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          ></div>
        ))}
      </div>
      <p className="text-gray-700 font-medium">Loading your content...</p>
    </div>
  );
};

export default Loading;
