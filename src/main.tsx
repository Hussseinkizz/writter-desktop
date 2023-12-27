import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "./routes.js";
// import ReactQueryProvider from "./utils/react-query-provider.js";
import "@/styles/globals.css";
import "@/styles/custom.module.css";
import { storeConfig } from "./react-hands-v2.jsx";
import AppLayout from "./components/app-layout.js";

// import dotenv from "dotenv";
// dotenv.config();

// Define initial state and actions
const store = {
  count: 0,
  local_userData: {
    credits: 0,
    names: "",
    token: "",
  },
  currentPage: "Dashboard",
  drawerOpen: true,
  notificationsOpen: false,
};

const actions = {
  decrement: (state: any) => ({ count: state.count - 1 }),
  increment: (state: any) => ({ count: state.count + 1 }),
  setLocalUserData: (state: any, { payload }: any) => ({
    local_userData: payload,
  }),
  setCurrentPage: (state: any, { payload }: any) => ({
    currentPage: payload,
  }),
  openDrawer: () => ({
    drawerOpen: true,
  }),
  closeDrawer: () => ({
    drawerOpen: false,
  }),
  toggleDrawer: (state: any) => ({
    drawerOpen: !state.drawerOpen,
  }),
  toggleIsVerifying: (state: any) => ({
    isVerifying: !state.isVerifying,
  }),
  toggleNotifications: (state: any) => ({
    notificationsOpen: !state.notificationsOpen,
  }),
  closeNotifications: () => ({
    notificationsOpen: false,
  }),
};

// Configure the store
const StoreProvider = storeConfig(store, actions);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <ReactQueryProvider> */}
      <StoreProvider>
        <AppLayout>
          <RoutesConfig />
        </AppLayout>
      </StoreProvider>
      {/* </ReactQueryProvider> */}
    </BrowserRouter>
  </React.StrictMode>,
);
