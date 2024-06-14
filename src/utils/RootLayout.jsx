import Navbar from "../components/Navbar/NavbarOld";

const RootLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default RootLayout;
