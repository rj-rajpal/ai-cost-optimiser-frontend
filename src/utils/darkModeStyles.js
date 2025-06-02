// Dark Mode Style Utilities
// Functions to generate dark mode-aware CSS classes

/**
 * Generate dark mode-aware header styles
 * @param {boolean} isDarkMode - Current dark mode state
 * @returns {object} - Header style object with dynamic classes
 */
export const getHeaderStyles = (isDarkMode) => ({
  MAIN: `backdrop-blur-sm border-b sticky top-0 z-30 transition-colors duration-300 ${
    isDarkMode 
      ? 'bg-black/90 border-gray-800 shadow-2xl' 
      : 'bg-white/90 border-sky-gray shadow-mist'
  }`,
  CONTENT: "px-4 sm:px-6 lg:px-8",
  INNER: "flex items-center justify-between h-16",
  LEFT_SECTION: "flex items-center space-x-4",
  LOGO_SECTION: "flex items-center space-x-3",
  LOGO: `w-8 h-8 bg-muted-indigo rounded-lg flex items-center justify-center border ${
    isDarkMode ? 'border-gray-700' : 'border-sky-gray'
  }`,
  TITLE: `text-xl font-semibold transition-colors duration-300 ${
    isDarkMode ? 'text-white' : 'text-soft-navy'
  }`,
});

/**
 * Generate dark mode-aware button styles
 * @param {boolean} isDarkMode - Current dark mode state
 * @returns {object} - Button style object with dynamic classes
 */
export const getButtonStyles = (isDarkMode) => ({
  PRIMARY: "bg-muted-indigo hover:bg-muted-indigo/90 text-white transition-colors duration-200",
  SECONDARY: `border transition-colors duration-200 ${
    isDarkMode 
      ? 'bg-black border-gray-800 text-white hover:bg-gray-900' 
      : 'bg-white border-sky-gray text-charcoal-black hover:bg-fog-gray'
  }`,
  GHOST: `transition-colors duration-200 ${
    isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-fog-gray'
  }`,
  MENU: `p-2 rounded-md transition-colors duration-200 ${
    isDarkMode 
      ? 'text-white hover:bg-gray-900' 
      : 'text-soft-navy hover:bg-fog-gray'
  }`,
  USER: `flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${
    isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-fog-gray'
  }`,
  SEND: "ml-2 p-2 rounded-full bg-muted-indigo hover:bg-muted-indigo/90 transition-colors disabled:opacity-50",
  SIDEBAR: "w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200",
  CLOSE: "mb-4 p-2 rounded-md hover:bg-white/10 transition-colors duration-200",
  TAB: "py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200",
  TAB_ACTIVE: `border-muted-indigo transition-colors duration-300 ${
    isDarkMode ? 'text-white' : 'text-muted-indigo'
  }`,
  TAB_INACTIVE: `border-transparent transition-colors duration-200 ${
    isDarkMode 
      ? 'text-gray-400 hover:text-white hover:border-gray-600' 
      : 'text-slate-gray hover:text-charcoal-black hover:border-sky-gray'
  }`,
  BREADCRUMB: `transition-colors duration-200 font-medium ${
    isDarkMode 
      ? 'text-gray-300 hover:text-white' 
      : 'text-slate-gray hover:text-soft-navy'
  }`,
});

/**
 * Generate dark mode-aware UI styles
 * @param {boolean} isDarkMode - Current dark mode state
 * @returns {object} - UI style object with dynamic classes
 */
export const getUIStyles = (isDarkMode) => ({
  AVATAR: "w-8 h-8 rounded-full bg-gradient-to-r from-muted-indigo to-mist-teal flex items-center justify-center",
  DROPDOWN: `absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 z-50 transition-colors duration-300 ${
    isDarkMode 
      ? 'bg-black border-gray-800' 
      : 'bg-white border-sky-gray shadow-mist'
  }`,
  DROPDOWN_ITEM: `w-full px-4 py-2 text-left transition-colors duration-200 ${
    isDarkMode 
      ? 'text-white hover:bg-gray-900' 
      : 'text-charcoal-black hover:bg-fog-gray'
  }`,
  SIGN_OUT_ITEM: `w-full px-4 py-2 text-left text-red-600 transition-colors duration-200 cursor-pointer ${
    isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-soft-rose'
  }`,
  OVERLAY: "fixed inset-0 z-40",
  BACKDROP: "fixed inset-0 bg-black/20 z-40",
});

/**
 * Generate dark mode-aware navigation styles
 * @param {boolean} isDarkMode - Current dark mode state
 * @returns {object} - Navigation style object with dynamic classes
 */
export const getNavStyles = (isDarkMode) => ({
  BREADCRUMB: "flex items-center space-x-2 text-sm mb-4",
  TABS_CONTAINER: "flex space-x-8 overflow-x-auto",
  TITLE_CONTAINER: "flex items-center space-x-4",
  TITLE_ICON: `w-12 h-12 bg-gradient-to-r from-mist-teal/20 to-muted-indigo/20 rounded-lg flex items-center justify-center border ${
    isDarkMode ? 'border-gray-700' : 'border-sky-gray'
  }`,
});

/**
 * Generate dark mode-aware card styles
 * @param {boolean} isDarkMode - Current dark mode state
 * @returns {object} - Card style object with dynamic classes
 */
export const getCardStyles = (isDarkMode) => ({
  BASE: `rounded-lg border p-6 transition-colors duration-300 ${
    isDarkMode 
      ? 'bg-black border-gray-800' 
      : 'bg-white border-sky-gray'
  }`,
  ELEVATED: `rounded-lg border p-6 transition-colors duration-300 ${
    isDarkMode 
      ? 'bg-black border-gray-800 shadow-2xl' 
      : 'bg-white shadow-mist border-sky-gray'
  }`,
  TITLE_SECTION: `flex flex-col px-4 sm:px-6 lg:px-8 py-6 transition-colors duration-300 ${
    isDarkMode ? 'bg-black' : 'bg-white'
  }`,
  TABS_SECTION: `border-b px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
    isDarkMode 
      ? 'bg-black border-gray-800' 
      : 'bg-white border-sky-gray'
  }`,
  LOADING: "text-center",
});

/**
 * Generate dark mode-aware text styles
 * @param {boolean} isDarkMode - Current dark mode state
 * @returns {object} - Text style object with dynamic classes
 */
export const getTextStyles = (isDarkMode) => ({
  TITLE_LARGE: `text-4xl font-bold mb-2 transition-colors duration-300 ${
    isDarkMode ? 'text-white' : 'text-soft-navy'
  }`,
  TITLE_SECTION: `text-3xl font-bold transition-colors duration-300 ${
    isDarkMode ? 'text-white' : 'text-soft-navy'
  }`,
  TITLE_CARD: `text-xl font-semibold mb-2 transition-colors duration-300 ${
    isDarkMode ? 'text-white' : 'text-soft-navy'
  }`,
  SUBTITLE: `transition-colors duration-300 ${
    isDarkMode ? 'text-gray-300' : 'text-slate-gray'
  }`,
  BODY: `transition-colors duration-300 ${
    isDarkMode ? 'text-white' : 'text-charcoal-black'
  }`,
  CAPTION: "text-xs text-white/50 mt-1",
  BREADCRUMB: `font-medium transition-colors duration-300 ${
    isDarkMode ? 'text-white' : 'text-slate-gray'
  }`,
  WHITE_PRIMARY: "text-sm text-white/90 font-medium",
  WHITE_SECONDARY: "text-xs text-white/50 mt-1",
});

/**
 * Generate dark mode-aware form styles
 * @param {boolean} isDarkMode - Current dark mode state
 * @returns {object} - Form style object with dynamic classes
 */
export const getFormStyles = (isDarkMode) => ({
  INPUT: `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-all duration-200 ${
    isDarkMode 
      ? 'bg-black border-gray-800 text-white placeholder-gray-500' 
      : 'bg-white border-sky-gray text-charcoal-black placeholder-slate-gray'
  }`,
  LABEL: `block text-sm font-medium mb-2 transition-colors duration-300 ${
    isDarkMode ? 'text-white' : 'text-soft-navy'
  }`,
  SELECT: `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-all duration-200 ${
    isDarkMode 
      ? 'bg-black border-gray-800 text-white' 
      : 'bg-white border-sky-gray text-charcoal-black'
  }`,
  CHAT_INPUT: `flex-1 bg-transparent outline-none text-base px-2 transition-colors duration-300 ${
    isDarkMode 
      ? 'text-white placeholder-gray-500' 
      : 'text-charcoal-black placeholder-slate-gray'
  }`,
  CHAT_CONTAINER: `border rounded-2xl shadow-lg flex items-center w-full max-w-2xl px-4 py-3 mb-6 mx-4 transition-colors duration-300 ${
    isDarkMode 
      ? 'bg-black border-gray-800' 
      : 'bg-white border-sky-gray'
  }`,
  CHAT_FORM: "fixed bottom-0 left-0 w-full flex justify-center z-50 bg-transparent",
});

/**
 * Helper function to get all dynamic styles at once
 * @param {boolean} isDarkMode - Current dark mode state
 * @returns {object} - Complete style object with all dynamic classes
 */
export const getDynamicStyles = (isDarkMode) => ({
  HEADER: getHeaderStyles(isDarkMode),
  BUTTONS: getButtonStyles(isDarkMode),
  UI: getUIStyles(isDarkMode),
  NAV_STYLES: getNavStyles(isDarkMode),
  CARDS: getCardStyles(isDarkMode),
  TEXT: getTextStyles(isDarkMode),
  FORMS: getFormStyles(isDarkMode),
}); 