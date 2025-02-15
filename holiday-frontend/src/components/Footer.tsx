// Footer Component
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-sm mt-12 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Holiday Finder App. All rights
            reserved.
          </p>
          <p className="mt-2">Made with ❤️ using React and Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
