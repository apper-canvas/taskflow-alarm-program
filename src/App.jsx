import React, { createContext, useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { router } from "./router";
import PromptPassword from "@/components/pages/PromptPassword";
import NotFound from "@/components/pages/NotFound";
import Callback from "@/components/pages/Callback";
import ErrorPage from "@/components/pages/ErrorPage";
import Projects from "@/components/pages/Projects";
import Signup from "@/components/pages/Signup";
import Clients from "@/components/pages/Clients";
import Login from "@/components/pages/Login";
import TaskManager from "@/components/pages/TaskManager";
import ResetPassword from "@/components/pages/ResetPassword";
import { clearUser, setUser } from "@/store/userSlice";
// Create auth context

function App() {
  const dispatch = useDispatch();
  
  // Get authentication status with proper error handling
  // Initialize ApperUI once when the app loads
  
  return <RouterProvider router={router} />;
}

export default App;