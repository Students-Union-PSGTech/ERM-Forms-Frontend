const SESSION_KEY = 'auth_session_active';
const TAB_ID_KEY = 'tab_id';

// Generate a unique tab ID
const generateTabId = () => `tab_${Date.now()}_${Math.random()}`;

// Get or create tab ID
export const getTabId = () => {
  let tabId = sessionStorage.getItem(TAB_ID_KEY);
  if (!tabId) {
    tabId = generateTabId();
    sessionStorage.setItem(TAB_ID_KEY, tabId);
  }
  return tabId;
};

// Set session as active for this tab
export const setSessionActive = () => {
  const tabId = getTabId();
  localStorage.setItem(SESSION_KEY, tabId);
};

// Check if this tab has an active session
export const isActiveSession = () => {
  const tabId = getTabId();
  const activeTabId = localStorage.getItem(SESSION_KEY);
  
  // If no active session or this is the active tab, allow access
  return !activeTabId || activeTabId === tabId;
};

// Clear session
export const clearSession = () => {
  const tabId = getTabId();
  const activeTabId = localStorage.getItem(SESSION_KEY);
  
  // Only clear if this tab is the active one
  if (activeTabId === tabId) {
    localStorage.removeItem(SESSION_KEY);
  }
  sessionStorage.removeItem(TAB_ID_KEY);
};