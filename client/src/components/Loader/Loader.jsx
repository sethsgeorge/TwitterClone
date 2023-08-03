import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center space-x-2">
      <p>Loading</p>
      <div className="animate-spin rounded-full border-t-4 border-blue-500 border-solid h-6 w-6"></div>
    </div>
  );
};

export default Loader;