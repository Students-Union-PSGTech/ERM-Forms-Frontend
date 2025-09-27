import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  body {
    background-color: #f5f5f5;
    color: #111;
  }
  h2 {
    margin-bottom: 1rem;
    color: #2563eb;
  }
  button {
    cursor: pointer;
  }
`;
