import React, { useState, useEffect } from "react";
import { FaArrowRight, FaCoins, FaBomb, FaDice, FaCog, FaExchangeAlt, FaTimes, FaAngleUp, FaAngleDown, FaInfoCircle, FaRobot } from "react-icons/fa";
import CustomSelect from "@/components/CustomSelect";
import CustomInput from "@/components/CustomInput";
import { motion, AnimatePresence } from "framer-motion";

const DynamicForm = ({ config, onSubmit, gameStatus = { isPlaying: false, hasPlacedBet: false } }) => {
  // State to manage form values
  const [formData, setFormData] = useState({});
  const [expanded, setExpanded] = useState(true);
  
  // Initialize form with default values from config
  useEffect(() => {
    const initialData = {};
    config.fields.forEach(field => {
      initialData[field.id] = field.defaultValue !== undefined 
        ? field.defaultValue 
        : field.type === "multiSelect" ? [] : "";
    });
    setFormData(initialData);
  }, [config]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (name, selectedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedValues,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass the form data to the parent
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // Group fields for better organization in auto mode
  const getFieldGroups = () => {
    if (config.submitButton !== "START AUTO BETTING") {
      return { main: config.fields };
    }
    
    return {
      main: config.fields.slice(0, 3),
      advanced: config.fields.slice(3)
    };
  };
  
  const fieldGroups = getFieldGroups();
  const isAutoMode = config.submitButton === "START AUTO BETTING";

  // Custom animations for form fields
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl shadow-xl overflow-hidden bg-gradient-to-br from-[#1A0015] to-[#120010] border border-purple-800/30"
    >
      {/* Form Header */}
      <div className="bg-gradient-to-r from-[#250027] to-[#190018] p-4 flex justify-between items-center cursor-pointer border-b border-purple-900/30" 
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <div className="p-2.5 rounded-full bg-gradient-to-br from-purple-700/40 to-purple-900/30 mr-3 shadow-inner shadow-purple-900/20 border border-purple-800/20">
            {isAutoMode ? 
              <FaRobot className="text-blue-400 text-lg" /> : 
              <FaDice className="text-purple-400 text-lg" />
            }
          </div>
          <div>
            <h3 className="text-white font-bold text-lg font-display">
              {isAutoMode ? "Auto Betting" : "Manual Betting"}
            </h3>
            <p className="text-white/60 text-xs mt-0.5">
              {isAutoMode ? "Configure auto betting parameters" : "Place individual bets manually"}
            </p>
          </div>
        </div>
        <button className="p-2 text-white/60 hover:text-white bg-purple-900/20 rounded-full hover:bg-purple-900/30 transition-all">
          {expanded ? <FaAngleUp /> : <FaAngleDown />}
        </button>
      </div>
      
      {/* Form Body */}
      <AnimatePresence>
        {expanded && (
          <motion.form 
            onSubmit={handleSubmit} 
            className="p-5 space-y-5"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main Fields with better grouping */}
            <motion.div 
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <div className="pb-2 mb-1 border-b border-purple-900/20">
                <h4 className="text-white font-semibold text-sm flex items-center">
                  <div className="p-1.5 rounded-full bg-gradient-to-br from-purple-700/40 to-purple-900/20 mr-2 border border-purple-800/20">
                    <FaDice className="text-purple-400 text-xs" />
                  </div>
                  Game Settings
                </h4>
              </div>
              
              {fieldGroups.main.map((field) => (
                <motion.div 
                  key={field.id} 
                  className="relative"
                  variants={item}
                >
                  {field.type === "singleSelect" && (
                    <CustomSelect
                      id={field.id}
                      name={field.id}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                      label={field.label}
                      options={field.options}
                      className="pl-11 bg-black/20 border-purple-800/30 focus:border-purple-600/50"
                      disabled={gameStatus.isPlaying || gameStatus.hasPlacedBet}
                    />
                  )}

                  {field.type === "text" && (
                    <CustomInput
                      type="text"
                      label={field.label}
                      id={field.id}
                      name={field.id}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder || ""}
                      className="pl-11 bg-black/20 border-purple-800/30 focus:border-purple-600/50"
                      disabled={gameStatus.isPlaying || gameStatus.hasPlacedBet}
                    />
                  )}

                  {field.type === "number" && (
                    <CustomInput
                      type="number"
                      label={field.label}
                      id={field.id}
                      name={field.id}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder || ""}
                      className="pl-11 bg-black/20 border-purple-800/30 focus:border-purple-600/50"
                      disabled={gameStatus.isPlaying || gameStatus.hasPlacedBet}
                    />
                  )}

                  {field.type === "boolean" && (
                    <CustomInput
                      type="boolean"
                      label={field.label}
                      id={field.id}
                      name={field.id}
                      value={formData[field.id] || false}
                      onChange={handleChange}
                      className="pl-11 bg-black/20 border-purple-800/30 focus:border-purple-600/50"
                      disabled={gameStatus.isPlaying || gameStatus.hasPlacedBet}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
            
            {/* Advanced Fields for Auto Mode with better separation */}
            {isAutoMode && fieldGroups.advanced && fieldGroups.advanced.length > 0 && (
              <motion.div 
                className="pt-4"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <div className="pb-3 mb-4 border-b border-purple-900/20">
                  <h4 className="text-blue-400 text-sm font-semibold flex items-center">
                    <div className="p-1.5 rounded-full bg-gradient-to-br from-blue-700/40 to-blue-900/20 mr-2 border border-blue-800/20">
                      <FaCog className="text-blue-400 text-xs" />
                    </div>
                    Advanced Strategy Settings
                  </h4>
                </div>
                
                <div className="space-y-5">
                  {fieldGroups.advanced.map((field) => (
                    <motion.div 
                      key={field.id} 
                      className="relative"
                      variants={item}
                    >
                      {field.type === "singleSelect" && (
                        <CustomSelect
                          id={field.id}
                          name={field.id}
                          value={formData[field.id] || ""}
                          onChange={handleChange}
                          label={field.label}
                          options={field.options}
                          className="pl-11 bg-black/20 border-purple-800/30 focus:border-purple-600/50"
                          disabled={gameStatus.isPlaying || gameStatus.hasPlacedBet}
                        />
                      )}

                      {field.type === "text" && (
                        <CustomInput
                          type="text"
                          label={field.label}
                          id={field.id}
                          name={field.id}
                          value={formData[field.id] || ""}
                          onChange={handleChange}
                          placeholder={field.placeholder || ""}
                          className="pl-11 bg-black/20 border-purple-800/30 focus:border-purple-600/50"
                          disabled={gameStatus.isPlaying || gameStatus.hasPlacedBet}
                        />
                      )}

                      {field.type === "number" && (
                        <CustomSelect
                          type="number"
                          label={field.label}
                          id={field.id}
                          name={field.id}
                          value={formData[field.id] || ""}
                          onChange={handleChange}
                          placeholder={field.placeholder || ""}
                          className="pl-11 bg-black/20 border-purple-800/30 focus:border-purple-600/50"
                          disabled={gameStatus.isPlaying || gameStatus.hasPlacedBet}
                        />
                      )}

                      {field.type === "boolean" && (
                        <CustomInput
                          type="boolean"
                          label={field.label}
                          id={field.id}
                          name={field.id}
                          value={formData[field.id] || false}
                          onChange={handleChange}
                          className="pl-11 bg-black/20 border-purple-800/30 focus:border-purple-600/50"
                          disabled={gameStatus.isPlaying || gameStatus.hasPlacedBet}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Submit Button with improved styling */}
            <motion.button
              type="submit"
              onClick={handleSubmit}
              disabled={gameStatus.isPlaying || gameStatus.hasPlacedBet}
              className={`w-full py-3.5 ${
                gameStatus.isPlaying || gameStatus.hasPlacedBet
                  ? 'bg-gray-700 cursor-not-allowed opacity-50'
                  : isAutoMode 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
              } rounded-lg text-white font-bold shadow-lg transition-all flex items-center justify-center mt-6`}
              whileHover={{ scale: gameStatus.isPlaying || gameStatus.hasPlacedBet ? 1 : 1.02 }}
              whileTap={{ scale: gameStatus.isPlaying || gameStatus.hasPlacedBet ? 1 : 0.98 }}
            >
              {isAutoMode ? (
                <span className="inline-flex items-center mr-2 text-xl">
                  <FaRobot className="text-white text-xl" />
                </span>
              ) : (
                <span className="inline-flex items-center mr-2 text-xl">
                  <FaDice className="text-white text-xl" />
                </span>
              )}
              <span className="text-lg">
                {gameStatus.isPlaying || gameStatus.hasPlacedBet 
                  ? "GAME IN PROGRESS" 
                  : isAutoMode ? "START AUTO BETTING" : "START GAME"
                }
              </span>
              <FaArrowRight className="ml-2" />
            </motion.button>
            
            {/* How to Play Info with improved styling */}
            <div className="mt-4 p-4 bg-gradient-to-br from-purple-900/10 to-black/20 rounded-lg border border-purple-800/20 shadow-inner">
              <div className="text-sm text-white/80 flex items-start">
                <div className="p-2 bg-gradient-to-br from-blue-900/30 to-purple-900/20 rounded-full mr-3 flex-shrink-0 border border-purple-800/30">
                  <FaInfoCircle className="text-blue-400" />
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-1">{isAutoMode ? "Auto Betting Mode" : "Manual Mode"}</h5>
                  {isAutoMode ? (
                    <p>
                      Set mines, bet amount and tiles to reveal. The system will automatically place bets and cash out based on your strategy settings. Use stop limits to manage risk.
                    </p>
                  ) : (
                    <p>
                      Set mines and bet amount, then click tiles yourself to reveal gems. Cash out anytime to secure your winnings before hitting a mine.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DynamicForm;
