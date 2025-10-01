export const setSessionActive = () => {
  sessionStorage.setItem('activeSession', 'true');
};

export const clearSession = () => {
  sessionStorage.removeItem('activeSession');
};

export const isActiveSession = () => {
  return sessionStorage.getItem('activeSession') === 'true';
};