import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <>
      <hr/>
      <footer style={{ display: "flex", justifyContent: "right"}}>
        <div>
          <strong>
            Copyright © 2023-2024{" "}
            <a href="https://samcintsolutions.in/" target="_blank" rel="noopener noreferrer">
              Samcint Solutions
            </a>
            .
          </strong>
          All rights reserved.
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
