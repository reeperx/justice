import { Link } from "react-router-dom";
import Search from "./Search";

const MainCategories = () => {
  return (
    <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-8">
      {/* links */}
      <div className="flex-1 flex items-center justify-between flex-wrap">
        <Link
          to="/posts"
          className="bg-[#B58C13] text-white rounded-full px-4 py-2"
        >
          All Posts
        </Link>
        <Link
          to="/posts?cat=cases"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Cases
        </Link>
        <Link
          to="/posts?cat=injustice"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Injustice
        </Link>
        <Link
          to="/posts?cat=reform"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Reform
        </Link>
        <Link
          to="/posts?cat=commentary"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Commentary
        </Link>
        <Link
          to="/posts?cat=voices"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Voices
        </Link>
      </div>
      <span className="text-xl font-medium">|</span>
      {/* search */}
      <Search />
    </div>
  );
};

export default MainCategories;
