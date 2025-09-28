import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  // Flame color theme variables
  :root {
    --flame-red: #dc2626;
    --flame-orange: #ea580c;
    --flame-yellow: #f59e0b;
    --flame-deep-red: #991b1b;
    --flame-light-orange: #fed7aa;
    --flame-gold: #d97706;
    --flame-crimson: #b91c1c;
    --flame-amber: #f97316;
    --gradient-fire: linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%);
    --gradient-ember: linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #ea580c 100%);
    --bg-dark: #1f2937;
    --bg-light: #f9fafb;
    --text-primary: #111827;
    --text-secondary: #6b7280;
    --border-light: #e5e7eb;
    --shadow-soft: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-medium: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-flame: 0 10px 25px -5px rgba(220, 38, 38, 0.4);
  }

  body {
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    color: var(--text-primary);
    line-height: 1.6;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 1rem;
    color: var(--text-primary);
  }

  h2 {
    font-size: 1.875rem;
    margin-bottom: 1.5rem;
  }

  button {
    cursor: pointer;
    font-family: inherit;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
    border: none;
    outline: none;
  }

  input, textarea, select {
    font-family: inherit;
    transition: all 0.2s ease-in-out;
    outline: none;
  }

  a {
    text-decoration: none;
    transition: all 0.2s ease-in-out;
  }

  .flame-gradient {
    background: var(--gradient-fire);
  }

  .ember-gradient {
    background: var(--gradient-ember);
  }

  .flame-shadow {
    box-shadow: var(--shadow-flame);
  }

  // Scrollbar styling
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--gradient-fire);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--gradient-ember);
  }
`;
