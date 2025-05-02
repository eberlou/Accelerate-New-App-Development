import React from 'react';
import logo from '../assets/openshift-logo.svg'; // Replace with the actual path to your logo file

const Header: React.FC = () => {
  return (
    <header className="w-full bg-black py-4 px-6 flex items-center">
      <img src={logo} alt="Red Hat Logo" className="h-8" />
      <h1 className="text-white text-xl font-display ml-4">
        Troubleshooting Dashboard
      </h1>
    </header>
  );
};

export default Header;