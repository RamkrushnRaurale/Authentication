import React from "react";
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn/SignIn";
import ForgotPassword from "./components/SignIn/ForgotPassword";
import ResetPassword from "./components/SignIn/ResetPassword";

import Dashboard from "./components/Dashboard/Dashboard";
import TextArea from "./components/Dashboard/TextArea";
import Products from "./components/Products/Products";
import Home from "./components/Dashboard/sidebarComp/Home";

import {
  AuthProvider,
  useAuth,
} from "./components/SignIn/AuthContext";


// ================= PRIVATE ROUTE =================

const PrivateRoute = ({ children }) => {

  const { user } = useAuth();

  return user
    ? children
    : <Navigate to="/SignIn" />;
};


// ================= APP =================

function App() {

  return (

    <AuthProvider>

      <BrowserRouter basename="/Authentication">

        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}

          <Route
            path="/"
            element={<Navigate to="/SignIn" />}
          />

          <Route
            path="/SignIn"
            element={<SignIn />}
          />

          <Route
            path="/SignUp"
            element={<SignUp />}
          />

          <Route
            path="/ForgotPassword"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />


          {/* ================= PRIVATE ROUTES ================= */}

          <Route
            path="/Dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/TextArea"
            element={
              <PrivateRoute>
                <TextArea />
              </PrivateRoute>
            }
          />

          <Route
            path="/Products"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />

          <Route
            path="/Home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />


          {/* ================= INVALID ROUTE ================= */}

          <Route
            path="*"
            element={<Navigate to="/SignIn" />}
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;