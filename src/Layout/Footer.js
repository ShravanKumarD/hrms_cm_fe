import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <>
        <hr />
        <footer
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            display: "flex",
            justifyContent: "right",
            backgroundColor: "#f8f9fa",
            padding: "0px",
            boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{marginTop:"6px"}}>
            <strong>
              Copyright © 2023-2024{" "}
              <a
                href="https://samcintsolutions.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Samcint Solutions Pvt. Ltd
              </a>
              .{" "}
            </strong>
            All rights reserved.{" "}
          </div>
          <p>&nbsp;</p>
          {/* <div style={{ textAlign: "right" }}>
            <b>Version</b> 1.0.0
          </div> */}
        </footer>
      </>
    );
  }
}
