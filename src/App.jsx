import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  LodeUserRequest,
  LoginSuccess,
  LodeUserFailure,
  LodeUserSuccess,
} from "./Redux/auth/authSlice.js";
import ProtectedRoute from "./utils/ProtectedRoute";
import { decrypt } from "./utils/encryptDecrypy.js";

import Home from "./components/Home/Home";
import StandardTrail from "./components/StandardTrail/StandardTrail";

import Ledger from "./components/Ledger/Ledger";

import StockSummary from "./components/StockSummary/StockSummary.jsx";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "standard-trail",
        element: <StandardTrail />,
      },
      {
        path: "standard-trail/:ladgerGroupId/:name",
        element: <StandardTrail />,
      },
      {
        path: "ledger",
        element: <Ledger />,
      },
      {
        path: "stock-summary",
        element: <StockSummary />,
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(LodeUserRequest());

      const loginData = localStorage.getItem("m24");

      if (loginData) {
        const decryptData = decrypt(loginData);
        const data = JSON.parse(decryptData);
        dispatch(LoginSuccess(data));
        dispatch(LodeUserSuccess(data));
      } else {
        dispatch(LodeUserFailure());
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
