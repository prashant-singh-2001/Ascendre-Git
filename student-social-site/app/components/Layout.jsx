import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <>
      <div className="my-2 ms-2 me-0 rounded-md">
        <Sidebar />
      </div>
      <div className="bg-base-100 flex-1 p-2 my-2 ms-1 me-2 rounded-md">
        {children}
      </div>
    </>
  );
};

export default Layout;
