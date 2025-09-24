import React from "react";
import { FaCoins, FaBomb, FaSearch, FaHistory, FaPercentage, FaStopCircle, FaRobot } from "react-icons/fa";
import { GiMining } from "react-icons/gi";

const CustomInput = ({
  id,
  name,
  value,
  onChange,
  className = "",
  label,
  options = [],
  type = "text", // Default type is text
  placeholder = "",
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
        return <FaStopCircle className="text-green-400" />;
      case 'stopOnLoss':
        return <FaStopCircle className="text-red-400" />;
      case 'aiAssist':
        return <FaRobot className="text-blue-400" />;
      default:
        return <GiMining className="text-white/70" />;
    }
  };

  // Format placeholder for specific fields
  const getFormattedPlaceholder = (fieldName) => {
    if (fieldName === 'betAmount') {
      return 'Enter bet amount in APTC';
    } else if (fieldName === 'stopOnProfit') {
      return 'Auto-stop at this profit (APTC)';
    } else if (fieldName === 'stopOnLoss') {
      return 'Auto-stop at this loss (APTC)';
    } else if (fieldName === 'numberOfBets') {
      return 'Number of rounds to play';
    } else {
      return placeholder || `Enter ${label}`;
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
          {type === "multiSelect" ? (
            <select
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              multiple
              className="w-full rounded-lg py-3 pl-11 pr-4 bg-gradient-to-br from-[#190026]/90 to-[#0D0015]/90 text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer text-sm"
            >
              {options.map((option, index) => (
                <option key={index} value={option} className="bg-[#190026] text-white py-2">
                  {option}
                </option>
              ))}
            </select>
          ) : type === "boolean" ? (
            <div className="w-full rounded-lg py-3 pl-11 pr-4 bg-gradient-to-br from-[#190026]/90 to-[#0D0015]/90 flex items-center justify-between">
              <span className="text-white font-medium text-sm mr-4 truncate">Enable AI Assistant</span>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  id={id}
                  name={name}
                  checked={value === "true" || value === true}
                  onChange={(e) => {
                    onChange({
                      target: {
                        name,
                        value: e.target.checked,
                      },
                    });
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ) : (
            <input
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              type={type}
              placeholder={getFormattedPlaceholder(name)}
              className={`w-full rounded-lg py-3 pl-11 ${(name === 'betAmount' || name.includes('stop')) ? 'pr-16' : 'pr-4'} bg-[#190026] text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer text-sm`}
              style={{ backgroundColor: '#190026' }}
            />
          )}
        </div>
        
        {/* Display units or help text for specific fields */}
        {(name === 'betAmount' || name.includes('stop')) && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-white/50 pointer-events-none bg-[#190026]/80 px-2 py-1 rounded">
            APTC
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomInput;
