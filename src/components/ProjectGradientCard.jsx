import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDarkMode } from '../contexts/DarkModeContext';
import { GradientCard } from './ui/gradient-card';
import Icon from './AppIcon';

export const ProjectGradientCard = ({ project, onProjectClick, onProjectDelete }) => {
  const { isDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCardClick = (e) => {
    if (!isMenuOpen && !showDeleteConfirm) {
      onProjectClick(project.id);
    }
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
    setIsMenuOpen(false);
  };

  const confirmDelete = (e) => {
    e.stopPropagation();
    onProjectDelete(project.id);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  // Get project icon based on name/type
  const getProjectIcon = (projectName) => {
    const name = projectName.toLowerCase();
    if (name.includes('support') || name.includes('triage')) return 'Headphones';
    if (name.includes('invoice') || name.includes('processing')) return 'FileText';
    if (name.includes('marketing') || name.includes('content')) return 'Megaphone';
    if (name.includes('catalog') || name.includes('product')) return 'Package';
    if (name.includes('ai') || name.includes('optimization')) return 'Zap';
    return 'FolderOpen';
  };

  // Get project color scheme based on project type
  const getProjectColors = (projectId) => {
    const colorSchemes = {
      'customer-support-triage': {
        primary: 'rgba(59, 130, 246, 0.8)',
        secondary: 'rgba(79, 70, 229, 0.6)',
        accent: 'rgba(147, 51, 234, 0.4)'
      },
      'invoice-processing-qa': {
        primary: 'rgba(16, 185, 129, 0.8)',
        secondary: 'rgba(20, 184, 166, 0.6)',
        accent: 'rgba(6, 182, 212, 0.4)'
      },
      'marketing-content-localisation': {
        primary: 'rgba(244, 63, 94, 0.8)',
        secondary: 'rgba(236, 72, 153, 0.6)',
        accent: 'rgba(239, 68, 68, 0.4)'
      },
      'product-catalog-enrichment': {
        primary: 'rgba(245, 158, 11, 0.8)',
        secondary: 'rgba(251, 191, 36, 0.6)',
        accent: 'rgba(249, 115, 22, 0.4)'
      }
    };

    const defaultSchemes = [
      {
        primary: 'rgba(167, 243, 208, 0.8)',
        secondary: 'rgba(134, 239, 172, 0.6)', 
        accent: 'rgba(74, 222, 128, 0.4)'
      },
      {
        primary: 'rgba(191, 219, 254, 0.8)',
        secondary: 'rgba(147, 197, 253, 0.6)',
        accent: 'rgba(96, 165, 250, 0.4)'
      },
      {
        primary: 'rgba(196, 181, 253, 0.8)',
        secondary: 'rgba(167, 139, 250, 0.6)',
        accent: 'rgba(139, 92, 246, 0.4)'
      }
    ];

    if (colorSchemes[projectId]) {
      return colorSchemes[projectId];
    }

    const hash = projectId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % defaultSchemes.length;
    return defaultSchemes[index];
  };

  const colors = getProjectColors(project.id);

  return (
    <div className={`relative ${isDarkMode ? 'text-white' : ''}`}>
      {/* Use GradientCard as the base */}
      <GradientCard
        width="100%"
        height="280px"
        colors={colors}
        onClick={handleCardClick}
        className="cursor-pointer group rounded-2xl"
      >
        {/* Project content */}
        <div className="flex flex-col h-full p-6">
          {/* Header with icon and menu */}
          <div className="flex items-start justify-between mb-4">
            {/* Project icon */}
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(225deg, #171c2c 0%, #121624 100%)",
                position: "relative",
                overflow: "hidden"
              }}
              whileHover={{
                boxShadow: "0 8px 16px -2px rgba(0, 0, 0, 0.3), 0 4px 8px -1px rgba(0, 0, 0, 0.2), inset 2px 2px 5px rgba(255, 255, 255, 0.15), inset -2px -2px 5px rgba(0, 0, 0, 0.7)",
                y: -2
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut"
              }}
            >
              {/* Top-left highlight for realistic lighting */}
              <div
                className="absolute top-0 left-0 w-2/3 h-2/3 opacity-40"
                style={{
                  background: "radial-gradient(circle at top left, rgba(255, 255, 255, 0.5), transparent 80%)",
                  pointerEvents: "none",
                  filter: "blur(10px)"
                }} 
              />

              {/* Bottom shadow for depth */}
              <div
                className="absolute bottom-0 left-0 w-full h-1/2 opacity-50"
                style={{
                  background: "linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)",
                  pointerEvents: "none",
                  backdropFilter: "blur(3px)"
                }} 
              />

              {/* Project icon */}
              <div className="flex items-center justify-center w-full h-full relative z-10">
                <Icon 
                  name={getProjectIcon(project.name)} 
                  size={20} 
                  className="text-white" 
                />
              </div>
            </motion.div>

            {/* Menu button */}
            <div className="relative">
              <button
                onClick={handleMenuClick}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode 
                    ? 'text-white/70 hover:text-white hover:bg-white/10' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-black/10'
                }`}
              >
                <Icon name="MoreVertical" size={20} />
              </button>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <div className={`absolute right-0 top-full mt-1 w-32 rounded-lg border shadow-lg py-1 z-50 ${
                  isDarkMode 
                    ? 'bg-gray-900 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <button
                    onClick={handleDeleteClick}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors duration-200 ${
                      isDarkMode 
                        ? 'text-red-400 hover:bg-red-500/20' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Project title */}
          <motion.h3
            className="text-xl font-semibold text-white mb-3"
            style={{
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
            initial={{ filter: "blur(3px)", opacity: 0.7 }}
            animate={{
              filter: "blur(0px)",
              opacity: 1,
              transition: { duration: 1.2, delay: 0.2 }
            }}
          >
            {project.name}
          </motion.h3>

          {/* Project description */}
          <motion.p
            className="text-sm mb-6 text-gray-300 flex-1"
            style={{
              lineHeight: 1.5,
              fontWeight: 350,
            }}
            initial={{ filter: "blur(3px)", opacity: 0.7 }}
            animate={{
              filter: "blur(0px)",
              opacity: 0.85,
              transition: { duration: 1.2, delay: 0.4 }
            }}
          >
            {project.summary}
          </motion.p>

          {/* Action button */}
          <motion.div
            className="mt-auto"
            initial={{ filter: "blur(3px)", opacity: 0.7 }}
            animate={{
              filter: "blur(0px)",
              opacity: 0.9,
              transition: { duration: 1.2, delay: 0.6 }
            }}
          >
            <button className="inline-flex items-center text-white text-sm font-medium group">
              Open Project
              <motion.svg
                className="ml-2 w-4 h-4"
                width="8"
                height="8"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                whileHover={{
                  x: 4
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut"
                }}
              >
                <path
                  d="M1 8H15M15 8L8 1M15 8L8 15"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round" 
                />
              </motion.svg>
            </button>
          </motion.div>
        </div>
      </GradientCard>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50" 
            onClick={cancelDelete}
          />
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-xl z-50 w-80 ${
            isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Delete Project
            </h3>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete "{project.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 