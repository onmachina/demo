import React from 'react'
import ReactDOM from 'react-dom/client'
import { WalletSelectorContextProvider } from "./contexts/WalletSelectorContext";
import Root from "./routes/root";
import KeyStore from './routes/keystore';
import { Buffer } from 'buffer'

// buffer pollyfill needed by Near Wallet Selector
globalThis.Buffer = Buffer

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  { path: "/keystore", element: <KeyStore /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WalletSelectorContextProvider>
      <RouterProvider router={router} />
    </WalletSelectorContextProvider>
  </React.StrictMode>,
);