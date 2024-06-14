import Navbar from "../components/Navbar/Navbar";

const RootLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default RootLayout;
