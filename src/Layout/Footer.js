import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <>
        <footer
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            display: "flex",
            justifyContent: "right",
            alignItems: "center", 
            backgroundColor: "#f8f9fa",
            padding: "5px 0",
            boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
            opacity: 1,
            height: "20px",
            zIndex:1
          }}
        >
          <div style={{ marginTop: "0" }}>
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
        </footer>
      </>
    );
  }
}
