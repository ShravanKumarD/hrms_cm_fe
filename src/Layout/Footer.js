import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <footer className="main-footer">
        <strong className="mr-1">
          Copyright © 2023-2024{" "}
          <a href="https://samcintsolutions.in/">Samcint Solutions</a>.
        </strong>
        All rights reserved.
        <div className="float-right d-none d-sm-inline-block">
          <b>Version</b> 1.0.0
        </div>
      </footer>
    );
  }
}
