import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="">
      <section className="">
        <div className="">{children}</div>
      </section>
    </div>
  );
};

export default Layout;
