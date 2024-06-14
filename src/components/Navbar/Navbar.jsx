import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import userLogo from "../../assets/user.png";
import Logo from "../../assets/MarwariLogoBlue.png";

import { logoutSuccess, clearMessage } from "../../Redux/auth/authSlice";
import Profile from "./Profile";
import "./Navbar.css";
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
    <>
      <header className="header">
        <div className="container-fluid">
          <a href="#" className="logo">
            <img src={Logo} style={{ height: "7vh" }} />
          </a>
          <input className="menu-btn" type="checkbox" id="menu-btn" />
          <label className="menu-icon" htmlFor="menu-btn">
            <span className="navicon" />
          </label>
          <ul className="menu">
            <li>
              <a href="/" className="active">
                DASHBOARD
              </a>
            </li>
            <li>
              <a href="/standard-trail">STANDARD TRIAL</a>
            </li>
            <li>
              <a href="/ledger">LEDGER</a>
            </li>
            <li>
              <a href="/stock-summary">STOCK SUMMARY</a>
            </li>
            <li>
              <a onClick={handleLogoutClick} style={{cursor:"pointer"}}>LOGOUT</a>
            </li>
          </ul>
        </div>
      </header>
      <br></br>
      <br></br>
      <br></br>
    </>

    // <header className={classes["nav-menu"]} aria-label="navigation bar">
    //   <div className={classes.container}>
    //     <div className={classes["nav-start"]}>
    //       {/* <Profile /> */}
    //       <h1 className={classes.hamburger}>Innov8x</h1>
    //       <nav
    //         className={
    //           mobileView ? `${classes.menu} ${classes.show}` : classes.menu
    //         }
    //       >
    //         <ul className={classes["menu-bar"]} style={{ paddingLeft: "0px" }}>
    //           <li>
    //             <NavLink
    //               className={({ isActive }) =>
    //                 isActive
    //                   ? `${classes["nav-link"]} ${classes["active-link"]}`
    //                   : classes["nav-link"]
    //               }
    //               to="/"
    //             >
    //               Dashboard
    //             </NavLink>
    //           </li>
    //           <li>
    //             <NavLink
    //               className={({ isActive }) =>
    //                 isActive
    //                   ? `${classes["nav-link"]} ${classes["active-link"]}`
    //                   : classes["nav-link"]
    //               }
    //               to="/standard-trail"
    //             >
    //               Standrad Trail
    //             </NavLink>
    //           </li>
    //           <li>
    //             <NavLink
    //               className={({ isActive }) =>
    //                 isActive
    //                   ? `${classes["nav-link"]} ${classes["active-link"]}`
    //                   : classes["nav-link"]
    //               }
    //               to="/ledger"
    //             >
    //               Ledger
    //             </NavLink>
    //           </li>
    //           <li>
    //             <NavLink
    //               className={({ isActive }) =>
    //                 isActive
    //                   ? `${classes["nav-link"]} ${classes["active-link"]}`
    //                   : classes["nav-link"]
    //               }
    //               to="/stock-summary"
    //             >
    //               Stock Summary
    //             </NavLink>
    //           </li>
    //         </ul>
    //       </nav>
    //     </div>

    //     <div className={classes["nav-end"]}>
    //       <div className="userProfile">
    //         <img src={userLogo} alt="_userLogo" width="40px" />
    //       </div>

    //       <Profile user={user} onClick={handleLogoutClick} />

    //       {/* <button className={classes.hamburger} onClick={handleMobileView}>
    //         <MenuIcon />
    //       </button> */}
    //     </div>
    //   </div>
    // </header>
  );
};

export default Navbar;
