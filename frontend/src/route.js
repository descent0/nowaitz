// route.js
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAuthStatus,
  logoutUser, // Make sure this exists in your userSlice
} from "./store/userSlice";
import { checkShop } from "./store/shopSlice";
import Loading from "./Components/loading";

// Components
import LandingPage from "./Components/User/landingPage";
import ServiceType from "./Components/User/ServiceType";
import ServiceStores from "./Components/User/ServiceStores";
import Shop from "./Components/User/Shop";
import BookAppointment from "./Components/User/BookAppointment";
import LoginPage from "./Components/Authentication/Login";
import UserRegistrationPage from "./Components/Authentication/UserRegistration";
import Profile from "./Components/User/profile/Profile";
import DashBoard from "./Components/ServiceMan/DashBoard";
import Appointments from "./Components/ServiceMan/Appointments";
import Services from "./Components/ServiceMan/Services";
import Schedule from "./Components/ServiceMan/Schedule";
import Settings from "./Components/ServiceMan/Settings";
import Employee from "./Components/ServiceMan/Employee";
import AdminDashBoard from './Components/Admin/DashBoard';
import RegisterShopForm from "./Components/utilComp/RegisterShopRequest";
import HomeShop from "./Components/ServiceMan/HomeShop";
import ShopLook from "./Components/ServiceMan/ShopLook";
import PendingRequest from "./Components/ServiceMan/PendingRequest";


// ✅ 1. Global Auth Checker — runs only once here
const GlobalAuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.authUser);
  const { isShopRegistered } = useSelector((state) => state.shop);

  useEffect(() => {
    dispatch(checkAuthStatus());
    dispatch(checkShop());

    // Optional: periodic check for token expiry
    const interval = setInterval(() => {
      dispatch(checkAuthStatus());
    }, 5 * 60 * 1000); // every 5 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

  if (loading) return <Loading />;

  return children;
};

// ✅ 2. Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.authUser);

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.authUser);
  const { isShopRegistered } = useSelector((state) => state.shop);

  if (loading) return <Loading />;

  if (isAuthenticated && user?.role === 'user') return <Navigate to="/" replace />;
  if (isAuthenticated && user?.role === 'admin') return <Navigate to="/AdminDashBoard" replace />;
  if (isAuthenticated && isShopRegistered) return <Navigate to="/shopDashBoard" replace />;

  return children;
};

// ✅ 3. Routes
const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <LandingPage />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <ServiceType /> },
      { path: ":serviceType", element: <ServiceStores /> },
      { path: ":serviceType/:shop", element: <Shop /> },
      { path: ":serviceType/:shop/book-appointment", element: <BookAppointment /> },
    ],
  },
  {
    path: "/login",
    element: (
      <RedirectIfAuthenticated>
        <LoginPage />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: "/userRegister",
    element: (
      <RedirectIfAuthenticated>
        <UserRegistrationPage />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/registerShop",
    element: <RegisterShopForm />,
  },
  {
    path: "/shopDashBoard",
    element: <HomeShop />,
    children: [
      { path: "", element: <DashBoard /> },
      { path: "appointments", element: <Appointments /> },
      { path: "services", element: <Services /> },
      { path: "schedule", element: <Schedule /> },
      { path: "settings", element: <Settings /> },
      { path: "manage-employee", element: <Employee /> },
      { path: "shop-look", element: <ShopLook /> },
      { path: "pending-requests", element: <PendingRequest /> },
    ],
  },
  {
    path: "/AdminDashBoard",
    element: (
      <ProtectedRoute>
        <AdminDashBoard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/passReset",
    element: <div>Email link to reset password</div>,
  },
]);

// ✅ 4. Final Router Export
export const AppRouter = () => {
  return (
    <GlobalAuthLoader>
      <RouterProvider router={routes} />
    </GlobalAuthLoader>
  );
};
