import React, { Component } from "react";
import { loadTree } from "../menuTreeHelper";
import { NavLink } from "react-router-dom";
import Logo from "../assets/samcintlogowhite.png";

export default class SidebarAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    };
  }

  componentDidMount() {
    let userData = JSON.parse(localStorage.getItem("user"));
    this.setState({ user: userData });
    loadTree();
  }

  render() {
    return (
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <img src={Logo} className="logo-main" alt="company-logo" />
        <a href="/" className="brand-link">
          <span className="brand-text font-weight-light ml-1">
            <strong>ADMIN</strong>
          </span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src={process.env.PUBLIC_URL + "/user-64.png"}
                className="img-circle elevation-2"
                alt="User Image"
              />
            </div>
            <div className="info">
              <a href="#" className="d-block">
                {this.state.user.fullname}
              </a>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
              <li className="nav-item">
                <NavLink exact to="/" className="nav-link">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>
                    Dashboard
                    <span className="right badge badge-success">Home</span>
                  </p>
                </NavLink>
              </li>
              {/* Attendance Management */}
              <li className="nav-item has-treeview">
                <NavLink
                  to="/fake-url"
                  className="nav-link"
                  activeClassName="nav-link"
                >
                  <i className="nav-icon fas fa-calendar-check" />
                  <p>
                    Attendance Management
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/attendance/timesheet" className="nav-link">
                      <i className="fas fa-calendar-alt nav-icon" />
                      <p>Timesheet</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/attendance/mark" className="nav-link">
                      <i className="fas fa-check-circle nav-icon" />
                      <p>Mark Attendance</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/attendance/startwork" className="nav-link">
                      <i className="fas fa-briefcase nav-icon" />
                      <p>Start Work</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/attendance-list" className="nav-link">
                      <i className="fas fa-list nav-icon" />
                      <p>Attendance List</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item has-treeview">
                <NavLink
                  to="/fake-url"
                  className="nav-link"
                  activeClassName="nav-link"
                >
                  <i className="nav-icon fa fa-rocket" />
                  <p>
                    Applications
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/application" className="nav-link">
                      <i className="fa fa-plus nav-icon" />
                      <p>Add Application</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/application-list" className="nav-link">
                      <i className="fas fa-list-ul nav-icon" />
                      <p>Application List</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink exact to="/departments" className="nav-link">
                  <i className="nav-icon fa fa-building" />
                  <p>Departments</p>
                </NavLink>
              </li>
              <li className="nav-item has-treeview">
                <NavLink
                  to="/fake-url"
                  className="nav-link"
                  activeClassName="nav-link"
                >
                  <i className="nav-icon fa fa-user" />
                  <p>
                    Employee
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/employee-add" className="nav-link">
                      <i className="fa fa-user-plus nav-icon" />
                      <p>Add Employee</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/employee-list" className="nav-link">
                      <i className="fas fa-users nav-icon" />
                      <p>Employee List</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item has-treeview">
                <NavLink
                  to="/fake-url"
                  className="nav-link"
                  activeClassName="nav-link"
                >
                  <i className="nav-icon fas fa-file-alt" />
                  <p>
                    Document Management
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/salary-slip-list" className="nav-link">
                      <i className="fas fa-file-invoice-dollar nav-icon" />
                      <p>Salary Slip</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/offer-letter-list" className="nav-link">
                      <i className="fas fa-file-signature nav-icon" />
                      <p>Offer Letter</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/hike-letter-list" className="nav-link">
                      <i className="fas fa-file-alt nav-icon" />
                      <p>Hike Letter</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/relieving-letter-list" className="nav-link">
                      <i className="fas fa-file-export nav-icon" />
                      <p>Relieving Letter</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/resignation-letter-list" className="nav-link">
                      <i className="fas fa-file-upload nav-icon" />
                      <p>Resignation Letter</p>
                    </NavLink>
                  </li>
                </ul>
              </li>{" "}
              <li className="nav-item">
                <NavLink to="/job-list" className="nav-link">
                  <i className="nav-icon fas fa-briefcase" />
                  <p>Job List</p>
                </NavLink>
              </li>
              <li className="nav-item has-treeview">
                <NavLink
                  to="/fake-url"
                  className="nav-link"
                  activeClassName="nav-link"
                >
                  <i className="nav-icon fas fa-rupee-sign" />
                  <p>
                    Payroll Management
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/salary-details" className="nav-link">
                      <i className="fas fa-rupee-sign nav-icon" />
                      <p>Manage Salary Details</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/salary-list" className="nav-link">
                      <i className="fas fa-users nav-icon" />
                      <p>Employee Salary List</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/payment" className="nav-link">
                      <i className="fas fa-money-check nav-icon" />
                      <p>Make Payment</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item has-treeview">
                <NavLink
                  to="/fake-url"
                  className="nav-link"
                  activeClassName="nav-link"
                >
                  <i className="nav-icon fas fa-money-bill" />
                  <p>
                    Expense Management
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/expense" className="nav-link">
                      <i className="fas fa-shopping-cart nav-icon" />
                      <p>Make Expense</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/expense-report" className="nav-link">
                      <i className="fas fa-file-invoice nav-icon" />
                      <p>Expense Report</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink exact to="/announcement" className="nav-link">
                  <i className="nav-icon fa fa-bell" />
                  <p>Announcements</p>
                </NavLink>
              </li>
            </ul>
          </nav>
          <div style={{ marginTop: "200px" }}></div>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    );
  }
}
