import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Preloader from "../Skeleton/Preloader";
import Login from "../components/Login/Login";
// import Navbar from "../components/Navbar/Navbar";
import RootLayout from "./RootLayout";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoadingRequest } = useSelector(
    (store) => store.auth
  );
  if (isLoadingRequest) return <Preloader />;

  if (!isAuthenticated && !isLoadingRequest) {
    return <Login />;
  }

  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
};

export default ProtectedRoute;
