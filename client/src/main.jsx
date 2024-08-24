import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserContextProvider } from "./context/UserContext";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import PostDetails from "./pages/PostDetails.jsx";
import EditPost from "./pages/EditPost.jsx";
import MyBlogs from "./pages/MyBlogs.jsx";
import Profile from "./pages/Profile.jsx";
import AuthLayout from "./components/AuthLayout.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        exact
        path="/"
        element={
          // <AuthLayout>
          <Home />
          // </AuthLayout>
        }
      />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/register" element={<Register />} />
      <Route
        exact
        path="/write"
        element={
          <AuthLayout>
            <CreatePost />
          </AuthLayout>
        }
      />
      <Route
        exact
        path="/posts/post/:id"
        element={
          <AuthLayout>
            <PostDetails />
          </AuthLayout>
        }
      />
      <Route
        exact
        path="/edit/:id"
        element={
          <AuthLayout>
            <EditPost />
          </AuthLayout>
        }
      />
      <Route
        exact
        path="/myblogs/:id"
        element={
          <AuthLayout>
            <MyBlogs />
          </AuthLayout>
        }
      />
      <Route
        exact
        path="/profile/:id"
        element={
          <AuthLayout>
            <Profile />
          </AuthLayout>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </UserContextProvider>
  </StrictMode>
);
