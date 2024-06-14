import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import userLogo from "../../assets/user.png";

import { logoutSuccess, clearMessage } from "../../Redux/auth/authSlice";
import Profile from "./Profile";

// Custom components

import classes from "./styles.module.css";

// const initialstate = {
//   browse: false,
//   discover: false,
//   transport: false,
//   attendance: false,
// };
const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // const [click, setClick] = useState(initialstate);
  const [mobileView, setMobileView] = useState(false);

  const handleLogoutClick = async () => {
    const confirm = window.confirm("Are you sure you want to log out");
    if (!confirm) {
      return;
    }

    localStorage.removeItem("m24");
    dispatch(logoutSuccess());
    dispatch(clearMessage());
  };

  return (
    <header className={classes["nav-menu"]} aria-label="navigation bar">
      <div className={classes.container}>
        <div className={classes["nav-start"]}>
          {/* <Profile /> */}
          <h1 className={classes.hamburger}>Innov8x</h1>
          <nav
            className={
              mobileView ? `${classes.menu} ${classes.show}` : classes.menu
            }
          >
            <ul className={classes["menu-bar"]} style={{ paddingLeft: "0px" }}>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? `${classes["nav-link"]} ${classes["active-link"]}`
                      : classes["nav-link"]
                  }
                  to="/"
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? `${classes["nav-link"]} ${classes["active-link"]}`
                      : classes["nav-link"]
                  }
                  to="/standard-trail"
                >
                  Standrad Trail
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? `${classes["nav-link"]} ${classes["active-link"]}`
                      : classes["nav-link"]
                  }
                  to="/ledger"
                >
                  Ledger
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? `${classes["nav-link"]} ${classes["active-link"]}`
                      : classes["nav-link"]
                  }
                  to="/stock-summary"
                >
                  Stock Summary
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className={classes["nav-end"]}>
          <div className="userProfile">
            <img src={userLogo} alt="_userLogo" width="40px" />
          </div>

          <Profile user={user} onClick={handleLogoutClick} />

          {/* <button className={classes.hamburger} onClick={handleMobileView}>
            <MenuIcon />
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
