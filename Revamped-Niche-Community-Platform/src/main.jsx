import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { CommunityProvider } from "./context/CommunityContext"; // ✅ Import CommunityProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <CommunityProvider>
          <App />
        </CommunityProvider>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
