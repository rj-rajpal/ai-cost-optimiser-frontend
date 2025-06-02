// Style Constants
// Centralized location for all CSS class combinations used across the application

// Common Layout Styles
export const LAYOUT = {
  CONTAINER: "min-h-screen bg-cloud-white",
  FLEX_COL: "flex flex-col",
  FLEX_CENTER: "flex items-center justify-center",
  MAIN_CONTENT: "p-4 sm:p-6 lg:p-8",
  MAX_WIDTH: "max-w-7xl mx-auto",
  GRID_2_COL: "grid grid-cols-1 md:grid-cols-2 gap-6",
};

// Header Styles
export const HEADER = {
  MAIN: "bg-white/90 backdrop-blur-sm border-b border-sky-gray sticky top-0 z-30 shadow-mist",
  CONTENT: "px-4 sm:px-6 lg:px-8",
  INNER: "flex items-center justify-between h-16",
  LEFT_SECTION: "flex items-center space-x-4",
  LOGO_SECTION: "flex items-center space-x-3",
  LOGO: "w-8 h-8 bg-muted-indigo rounded-lg flex items-center justify-center border border-sky-gray",
  TITLE: "text-xl font-semibold text-soft-navy",
};

// Button Styles  
export const BUTTONS = {
  PRIMARY: "bg-muted-indigo hover:bg-muted-indigo/90 text-white transition-colors duration-200",
  SECONDARY: "bg-white border border-sky-gray text-charcoal-black hover:bg-fog-gray transition-colors duration-200",
  GHOST: "hover:bg-fog-gray transition-colors duration-200",
  MENU: "p-2 rounded-md text-soft-navy hover:bg-fog-gray transition-colors duration-200",
  USER: "flex items-center space-x-3 p-2 rounded-lg hover:bg-fog-gray transition-colors duration-200",
  SEND: "ml-2 p-2 rounded-full bg-muted-indigo hover:bg-muted-indigo/90 transition-colors disabled:opacity-50",
  SIDEBAR: "w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200",
  CLOSE: "mb-4 p-2 rounded-md hover:bg-white/10 transition-colors duration-200",
  TAB: "py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200",
  TAB_ACTIVE: "border-muted-indigo text-muted-indigo",
  TAB_INACTIVE: "border-transparent text-slate-gray hover:text-charcoal-black hover:border-sky-gray",
  BREADCRUMB: "text-slate-gray hover:text-soft-navy transition-colors duration-200 font-medium",
};

// User Interface Elements
export const UI = {
  AVATAR: "w-8 h-8 rounded-full bg-gradient-to-r from-muted-indigo to-mist-teal flex items-center justify-center",
  DROPDOWN: "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-mist border border-sky-gray py-1 z-50",
  DROPDOWN_ITEM: "w-full px-4 py-2 text-left text-charcoal-black hover:bg-fog-gray transition-colors duration-200",
  SIGN_OUT_ITEM: "w-full px-4 py-2 text-left text-red-600 hover:bg-soft-rose transition-colors duration-200 cursor-pointer",
  OVERLAY: "fixed inset-0 z-40",
  BACKDROP: "fixed inset-0 bg-black/20 z-40",
};

// Form Styles
export const FORMS = {
  INPUT: "w-full px-4 py-2 bg-white border border-sky-gray rounded-lg text-charcoal-black placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-all duration-200",
  LABEL: "block text-sm font-medium text-soft-navy mb-2",
  SELECT: "w-full px-4 py-2 bg-white border border-sky-gray rounded-lg text-charcoal-black focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-all duration-200",
  CHAT_INPUT: "flex-1 bg-transparent outline-none text-charcoal-black placeholder-slate-gray text-base px-2",
  CHAT_CONTAINER: "bg-white border border-sky-gray rounded-2xl shadow-lg flex items-center w-full max-w-2xl px-4 py-3 mb-6 mx-4",
  CHAT_FORM: "fixed bottom-0 left-0 w-full flex justify-center z-50 bg-transparent",
};

// Typography
export const TEXT = {
  TITLE_LARGE: "text-4xl font-bold text-soft-navy mb-2",
  TITLE_SECTION: "text-3xl font-bold text-soft-navy",
  TITLE_CARD: "text-xl font-semibold text-soft-navy mb-2",
  SUBTITLE: "text-slate-gray",
  BODY: "text-charcoal-black",
  CAPTION: "text-xs text-white/50 mt-1",
  BREADCRUMB: "text-slate-gray font-medium",
  WHITE_PRIMARY: "text-sm text-white/90 font-medium",
  WHITE_SECONDARY: "text-xs text-white/50 mt-1",
};

// Card and Container Styles
export const CARDS = {
  BASE: "bg-white rounded-lg border border-sky-gray p-6",
  ELEVATED: "bg-white rounded-lg shadow-mist border border-sky-gray p-6",
  TITLE_SECTION: "flex flex-col bg-white px-4 sm:px-6 lg:px-8 py-6",
  TABS_SECTION: "bg-white border-b border-sky-gray px-4 sm:px-6 lg:px-8",
  LOADING: "text-center",
};

// Chat Interface Styles
export const CHAT = {
  CONTAINER: "flex-1 flex flex-col items-center justify-end w-full max-w-2xl mx-auto pb-32",
  MESSAGES: "w-full px-4 z-20",
  USER_MESSAGE: "flex justify-end mb-2 z-20",
  BOT_MESSAGE: "flex justify-start mb-2 z-20",
  USER_BUBBLE: "rounded-2xl px-4 py-2 shadow-sm bg-muted-indigo text-white z-20",
  BOT_BUBBLE: "bg-white text-charcoal-black border border-sky-gray rounded-2xl px-4 py-2 shadow-sm z-20",
  LOADING_MESSAGE: "bg-white border border-sky-gray px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2 z-20",
  LOADING_DOTS: "flex space-x-1 z-20",
  LOADING_DOT: "w-2 h-2 bg-slate-gray rounded-full animate-bounce z-20",
  LOADING_TEXT: "text-slate-gray text-xs z-20",
};

// Sidebar Styles
export const SIDEBAR = {
  MAIN: "fixed left-0 top-0 h-full w-80 bg-soft-navy text-white z-50 transform transition-transform duration-300 ease-in-out",
  CONTAINER: "flex flex-col h-full",
  HEADER: "p-4 border-b border-white/10",
  CONTENT: "flex-1 overflow-y-auto p-4",
  FOOTER: "p-4 border-t border-white/10",
  NEW_CHAT: "w-full flex items-center space-x-3 p-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors duration-200",
  PROJECTS_NAV: "w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 group border border-white/20",
  CHAT_ITEM: "w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 group",
  PROFILE_BUTTON: "flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200",
  TRANSFORM_OPEN: "translate-x-0",
  TRANSFORM_CLOSED: "-translate-x-full",
};

// Navigation Styles
export const NAV_STYLES = {
  BREADCRUMB: "flex items-center space-x-2 text-sm mb-4",
  TABS_CONTAINER: "flex space-x-8 overflow-x-auto",
  TITLE_CONTAINER: "flex items-center space-x-4",
  TITLE_ICON: "w-12 h-12 bg-gradient-to-r from-mist-teal/20 to-muted-indigo/20 rounded-lg flex items-center justify-center border border-sky-gray",
};

// Loading States
export const LOADING = {
  CONTAINER: "min-h-screen bg-cloud-white flex items-center justify-center",
  CONTENT: "text-center",
  ICON: "w-12 h-12 bg-muted-indigo rounded-full flex items-center justify-center mx-auto mb-4",
  TITLE: "text-xl font-semibold text-soft-navy mb-2",
  TEXT: "text-slate-gray",
};

// Utility Classes
export const UTILS = {
  SPACE_Y_6: "space-y-6",
  SPACE_X_3: "space-x-3",
  SPACE_X_4: "space-x-4",
  FLEX_SHRINK_0: "flex-shrink-0",
  MIN_W_0: "min-w-0",
  FLEX_1: "flex-1",
  TRUNCATE: "truncate",
  SR_ONLY: "sr-only",
  HIDDEN: "hidden",
  BLOCK: "block",
}; 