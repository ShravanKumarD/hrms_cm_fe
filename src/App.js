import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import SidebarAdmin from "./Layout/SidebarAdmin";
import SidebarManager from "./Layout/SidebarManager";
import SidebarEmployee from "./Layout/SidebarEmployee";
import Dashboard from "./components/Dashboard";
import DashboardManager from "./components/manager/Dashboard";
import DashboardEmployee from "./components/employee/Dashboard";
import Layout from "./Layout/Layout";
import EmployeeList from "./components/EmployeeList";
import EmployeeListManager from "./components/manager/EmployeeList";
import EmployeeAdd from "./components/EmployeeAdd";
import EmployeeView from "./components/EmployeeView";
import EmployeeViewEmployee from "./components/employee/EmployeeView";
import EmployeeViewManager from "./components/manager/EmployeeView";
import EmployeeEdit from "./components/EmployeeEdit";
import DocumentList from "./components/DocumentList";
import DocumentAdd from "./components/DocumentAdd";
import DocumentView from "./components/DocumentView";
import DocumentEdit from "./components/DocumentEdit";
import OfferLetterList from "./components/OfferLetterList";
import HikeLetterList from "./components/HikeLetterList";
import SalarySlipList from "./components/SalarySlipList";
import RelievingLetterList from "./components/RelievingLetterList";
import DepartmentList from "./components/DepartmentList";
import ApplicationList from "./components/ApplicationList";
import ApplicationListManager from "./components/manager/ApplicationList";
import ApplicationListEmployee from "./components/employee/ApplicationList";
import Application from "./components/Application";
import MarkAttendance from "./components/MarkAttendance";
import StartWork from "./components/StartWork";
import AttendanceList from "./components/AttendanceList";
import Timesheet from "./components/Timesheet";
import SalaryDetails from "./components/SalaryDetails";
import SalaryList from "./components/SalaryList";
import SalaryView from "./components/SalaryView";
import SalaryViewManager from "./components/manager/SalaryView";
import SalaryViewEmployee from "./components/employee/SalaryView";
import Payment from "./components/Payment";
import Expense from "./components/Expense";
import ExpenseManager from "./components/manager/Expense";
import ExpenseReport from "./components/ExpenseReport";
import ExpenseReportManager from "./components/manager/ExpenseReport";
import Announcement from "./components/Announcement";
import AnnouncementManager from "./components/manager/Announcement";
import AnnouncementEmployee from "./components/employee/Announcement";
import Register from "./components/Register";
import withAuth from "./withAuth";
import Login from "./components/Login";
import JobList from "./components/JobList";
import JobListManager from "./components/manager/JobList";
import MyDocuments from "./components/MyDocuments";
import "./App.css";

export default class App extends Component {
  render() {
    return (
      <>
        <Router>
          <Switch>
            <Route exact path="/login" component={LoginContainer} />
            <Route exact path="/register" component={RegisterContainer} />
            <Route path="/" component={withAuth(DefaultContainer)} />
          </Switch>
        </Router>
      </>
    );
  }
}

const LoginContainer = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      height: "600px",
    }}
  >
    <Route exact path="/" render={() => <Redirect to="/login" />} />
    <Route path="/login" component={Login} />
  </div>
);

const RegisterContainer = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      height: "600px",
    }}
  >
    <Route exact path="/" render={() => <Redirect to="/register" />} />
    <Route path="/register" component={Register} />
  </div>
);

const DefaultContainer = () => (
  <div>
    {JSON.parse(localStorage.getItem("user")).role === "ROLE_ADMIN"
      ? AdminContainer()
      : JSON.parse(localStorage.getItem("user")).role === "ROLE_MANAGER"
      ? ManagerContainer()
      : JSON.parse(localStorage.getItem("user")).role === "ROLE_EMPLOYEE"
      ? EmployeeContainer()
      : null}
  </div>
);

const AdminContainer = () => (
  <div>
    <Header />
    <SidebarAdmin />
    <Layout>
      <Switch>
        <Route exact path="/" component={withAuth(Dashboard)} />
        <Route exact path="/employee-list" component={withAuth(EmployeeList)} />
        <Route exact path="/employee-add" component={withAuth(EmployeeAdd)} />
        <Route exact path="/employee-view" component={withAuth(EmployeeView)} />
        <Route exact path="/employee-edit" component={withAuth(EmployeeEdit)} />
        <Route exact path="/document-list" component={withAuth(DocumentList)} />
        <Route exact path="/document-add" component={withAuth(DocumentAdd)} />
        <Route exact path="/document-view" component={withAuth(DocumentView)} />
        <Route exact path="/document-edit" component={withAuth(DocumentEdit)} />
        <Route exact path="/departments" component={withAuth(DepartmentList)} />
        <Route
          exact
          path="/hike-letter-list"
          component={withAuth(HikeLetterList)}
        />
        <Route
          exact
          path="/salary-slip-list"
          component={withAuth(SalarySlipList)}
        />
        <Route
          exact
          path="/offer-letter-list"
          component={withAuth(OfferLetterList)}
        />
        <Route
          exact
          path="/relieving-letter-list"
          component={withAuth(RelievingLetterList)}
        />
        <Route exact path="/job-list" component={withAuth(JobList)} />
        <Route
          exact
          path="/application-list"
          component={withAuth(ApplicationList)}
        />
        <Route exact path="/application" component={withAuth(Application)} />
        <Route
          exact
          path="/attendance/mark"
          component={withAuth(MarkAttendance)}
        />
        <Route
          exact
          path="/attendance/startwork"
          component={withAuth(StartWork)}
        />
        <Route
          exact
          path="/attendance/list"
          component={withAuth(AttendanceList)}
        />
        <Route
          exact
          path="/attendance/timesheet"
          component={withAuth(Timesheet)}
        />
        <Route
          exact
          path="/salary-details"
          component={withAuth(SalaryDetails)}
        />
        <Route exact path="/salary-list" component={withAuth(SalaryList)} />
        <Route exact path="/salary-view" component={withAuth(SalaryView)} />
        <Route exact path="/payment" component={withAuth(Payment)} />
        <Route exact path="/expense" component={withAuth(Expense)} />
        <Route
          exact
          path="/expense-report"
          component={withAuth(ExpenseReport)}
        />
        <Route exact path="/announcement" component={withAuth(Announcement)} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Layout>
    <Footer />
  </div>
);

const ManagerContainer = () => (
  <div>
    <Header />
    <SidebarManager />
    <Layout>
      <Switch>
        <Route exact path="/" component={withAuth(DashboardManager)} />
        <Route
          exact
          path="/employee-list"
          component={withAuth(EmployeeListManager)}
        />
        <Route
          exact
          path="/employee-view"
          component={withAuth(EmployeeViewManager)}
        />
        <Route exact path="/job-list" component={withAuth(JobListManager)} />
        <Route
          exact
          path="/application-list"
          component={withAuth(ApplicationListManager)}
        />
        <Route exact path="/application" component={withAuth(Application)} />
        <Route exact path="/expense" component={withAuth(ExpenseManager)} />
        <Route
          exact
          path="/salary-view"
          component={withAuth(SalaryViewManager)}
        />
        <Route
          exact
          path="/expense-report"
          component={withAuth(ExpenseReportManager)}
        />
        <Route
          exact
          path="/announcement"
          component={withAuth(AnnouncementManager)}
        />
        <Route
          exact
          path="/attendance/mark"
          component={withAuth(MarkAttendance)}
        />
        <Route
          exact
          path="/attendance/startwork"
          component={withAuth(StartWork)}
        />
        <Route
          exact
          path="/attendance/list"
          component={withAuth(AttendanceList)}
        />
        <Route
          exact
          path="/attendance/timesheet"
          component={withAuth(Timesheet)}
        />
        <Route exact path="/documents" component={withAuth(MyDocuments)} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Layout>
    <Footer />
  </div>
);

const EmployeeContainer = () => (
  <div>
    <Header />
    <SidebarEmployee />
    <Layout>
      <Switch>
        <Route exact path="/" component={withAuth(DashboardEmployee)} />
        <Route
          exact
          path="/employee-view"
          component={withAuth(EmployeeViewEmployee)}
        />
        <Route
          exact
          path="/application-list"
          component={withAuth(ApplicationListEmployee)}
        />
        <Route exact path="/application" component={withAuth(Application)} />
        <Route
          exact
          path="/salary-view"
          component={withAuth(SalaryViewEmployee)}
        />
        <Route
          exact
          path="/announcement"
          component={withAuth(AnnouncementEmployee)}
        />
        <Route
          exact
          path="/attendance/startwork"
          component={withAuth(StartWork)}
        />
        <Route
          exact
          path="/attendance/list"
          component={withAuth(AttendanceList)}
        />
        <Route
          exact
          path="/attendance/timesheet"
          component={withAuth(Timesheet)}
        />
        <Route exact path="/documents" component={withAuth(MyDocuments)} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Layout>
    <Footer />
  </div>
);
