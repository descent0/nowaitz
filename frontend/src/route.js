import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import LandingPage from "./Components/User/landingPage";
import Shop from "./Components/User/Shop";
import ServiceStores from "./Components/User/ServiceStores";
import ServiceType from "./Components/User/ServiceType";
import LoginPage from "./Components/Authentication/Login";
import UserRegistrationPage from "./Components/Authentication/UserRegistration";
import useAuth from "./utils/checkAuth";
import Profile from "./Components/User/profile/Profile";
import Loading from "./Components/loading";
import DashBoard from "./Components/ServiceMan/DashBoard";
import Appointments from "./Components/ServiceMan/Appointments";
import Services from "./Components/ServiceMan/Services";
import Schedule from "./Components/ServiceMan/Schedule";
import Settings from "./Components/ServiceMan/Settings";
import Employee from "./Components/ServiceMan/Employee";
import BookAppointment from "./Components/User/BookAppointment";
import { useEffect } from "react";
import { checkAuthStatus } from "./store/userSlice";
import AdminDashBoard from './Components/Admin/DashBoard';
import RegisterShopForm from "./Components/utilComp/RegisterShopRequest";
import { checkShop } from "./store/shopSlice";
import HomeShop from "./Components/ServiceMan/HomeShop";
import ShopLook from "./Components/ServiceMan/ShopLook";
import PendingRequest from "./Components/ServiceMan/PendingRequest";

const ProtectedComponents = ({ children }) => {

   const {isAuthenticated,loading}=useSelector((state)=>state.authUser);
   console.log(isAuthenticated,loading);
   const dispatch=useDispatch();
   useEffect(()=>{
    dispatch(checkAuthStatus());
   },[]);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const ProtectedComponentIfLogin = ({ children }) => {
  const { isAuthenticated, authLoading, user } = useSelector((state) => state.authUser);
  const { isShopRegistered } = useSelector((state) => state.shop);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
    dispatch(checkShop());
  }, [dispatch]);

  // Only show Loading for authLoading (not for OTP)
  if (authLoading) {
    return <Loading />;
  }

  if (isAuthenticated&& user.role==='user') {
    return <Navigate to="/" replace />;
  } else if (isShopRegistered) {
    return <Navigate to="/shopDashBoard" replace />;
  }else if (isAuthenticated && user.role === 'admin') {
    return <Navigate to="/adminDashBoard" replace />;
  }

  return children;
};

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedComponents>
        <LandingPage />
      </ProtectedComponents>
    ),
    children: [
      { path: "", element: <ServiceType /> },
      { path: "/:serviceType", element: <ServiceStores /> },
      { path: "/:serviceType/:shop", element: <Shop /> },
      { path:"/:serviceType/:shop/book-appointment",element:<BookAppointment/>}
    ],
  },
  {
    path: "/login",
    element: (
      <ProtectedComponentIfLogin>
        <LoginPage />
      </ProtectedComponentIfLogin>
    ),
  },
  { path: "/passReset", element: <div>Email link to reset password</div> },
  {
    path: "/userRegister",
    element: (
      <ProtectedComponentIfLogin>
        <UserRegistrationPage />
      </ProtectedComponentIfLogin>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedComponents>
        <Profile />
      </ProtectedComponents>
    ),
  },
  {
    path: "/registerShop",
    element: <RegisterShopForm/>
  },
  {
    path: "/shopDashBoard",
    element: <HomeShop />,
    children:[
      {path:"",element:<DashBoard/>},
      { path: "appointments", element: <Appointments /> },
      { path: "services", element: <Services /> },
      { path: "schedule", element: <Schedule /> },
      { path: "settings", element: <Settings /> },
      {
        path: "manage-employee",
        element: <Employee />,
      },{
        path:"shop-look",
        element:<ShopLook/>
      },{
        path:"pending-requests",
        element:<PendingRequest/>
      }
    ]
  },
  ,{
    path:"/AdminDashBoard",
    element:<ProtectedComponents><AdminDashBoard/></ProtectedComponents>
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={routes} />;
};
