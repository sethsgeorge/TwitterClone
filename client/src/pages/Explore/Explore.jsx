import React, { useState, useEffect } from "react";
import ExploreTweets from "../../components/ExploreTweets/ExploreTweets";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import { useSelector } from "react-redux";
import Signin from "../Signin/Signin";
import Loader from "../../components/Loader/Loader"

const Explore = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  useEffect(() => {
    // Simulating data fetching delay with a setTimeout
    setTimeout(() => {
      setIsLoading(false); // Set loading status to false after the data is fetched (remove this line if you have actual data fetching)
    }, 4000); // Change the time as per your requirement (remove this setTimeout if you have actual data fetching)
  }, []);

  return (
    <>
      {!currentUser ? (
        <Signin />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="px-6">
            <LeftSidebar />
          </div>
          <div className="col-span-2 border-x-2 border-t-slate-800 px-6">
            {/* Render the loading spinner while data is being fetched */}
            {isLoading ? <Loader /> : <ExploreTweets />}
          </div>
          <div className="px-6">
            <RightSidebar />
          </div>
        </div>
      )}
    </>
  );
};

export default Explore;