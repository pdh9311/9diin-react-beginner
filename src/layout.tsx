import { Outlet } from "react-router";
import { AppFooter, AppHeader } from "./components/common";
import useAuthListener from "./hooks/use-auth";

const RootLayout = () => {
  useAuthListener();

  return (
    <div className="page">
      <AppHeader />
      <div className="container">
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
};

export default RootLayout;
