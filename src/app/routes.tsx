import { createBrowserRouter } from "react-router-dom";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { PCDetail } from "./pages/PCDetail";
import { Booking } from "./pages/Booking";
import { LoginSelection } from "./pages/LoginSelection";
import { UserLogin } from "./pages/UserLogin";
import { OwnerLogin } from "./pages/OwnerLogin";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { AddPC } from "./pages/AddPC";
import { Guidelines } from "./pages/Guidelines";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "pc/:id", Component: PCDetail },
      { path: "booking/:id", Component: Booking },
      { path: "login", Component: LoginSelection },
      { path: "login/user", Component: UserLogin },
      { path: "login/owner", Component: OwnerLogin },
      { path: "register", Component: Register },
      { path: "profile", Component: Profile },
      { path: "owner/dashboard", Component: OwnerDashboard },
      { path: "owner/add-pc", Component: AddPC },
      { path: "guidelines", Component: Guidelines },
      { path: "*", Component: NotFound },
    ],
  },
]);