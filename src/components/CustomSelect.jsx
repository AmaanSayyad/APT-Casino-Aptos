import React from "react";
import { FaCoins, FaBomb, FaSearch, FaHistory, FaPercentage, FaStopCircle } from "react-icons/fa";
import { GiMining } from "react-icons/gi";

const CustomSelect = ({
  id,
  name,
  value,
  onChange,
  className = "",
  label,
  options = [],
}) => {
  // Helper function to determine icon based on field name
  const getIconForField = (fieldName) => {
    switch(fieldName) {
      case 'betAmount':
        return <FaCoins className="text-yellow-400" />;
      case 'mines':
        return <FaBomb className="text-red-400" />;
      case 'tilesToReveal':
        return <FaSearch className="text-blue-400" />;
      case 'numberOfBets':
        return <FaHistory className="text-purple-400" />;
      case 'onWin':
      case 'onLoss':
        return <FaPercentage className="text-green-400" />;
      case 'stopOnProfit':
      case 'stopOnLoss':
        return <FaStopCircle className="text-orange-400" />;
      default:
        return <GiMining className="text-white/70" />;
    }
  };

  // Format value display for specific fields
  const formatOptionDisplay = (option, fieldName) => {
    if (fieldName === 'betAmount') {
      return `${option.toLocaleString()} APT`;
    } else if (fieldName === 'mines') {
      return `${option} ${option === 1 ? 'Mine' : 'Mines'}`;
    } else if (fieldName === 'tilesToReveal') {
      return `${option} ${option === 1 ? 'Tile' : 'Tiles'}`;
    } else if (fieldName.includes('stop')) {
      return `${option.toLocaleString()} APT`;
    } else {
      return option;
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="font-medium text-white text-sm">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Icon for the field */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg z-10">
          {getIconForField(name)}
        </div>
        
        <div className="magic-gradient p-0.5 rounded-lg shadow-lg">
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full rounded-lg py-3 pl-11 pr-4 bg-[#190026] text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer text-sm appearance-none"
            style={{ 
              backgroundColor: '#190026',
              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1em" 
            }}
          >
            <option value="" disabled className="bg-[#190026] text-white/70">
              Select {label}
            </option>
            {options.map((option, index) => (
              <option 
                key={index} 
                value={option} 
                className="bg-[#190026] text-white py-2"
              >
                {formatOptionDisplay(option, name)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;
