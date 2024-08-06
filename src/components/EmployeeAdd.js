import React, { Component } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";

const cities = {
  cities: [
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Hyderabad",
    "Ahmedabad",
    "Chennai",
    "Kolkata",
    "Surat",
    "Pune",
    "Jaipur",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Visakhapatnam",
    "Bhopal",
    "Patna",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Vadodara",
    "Faridabad",
    "Meerut",
    "Rajkot",
    "Varanasi",
    "Srinagar",
    "Aurangabad",
    "Dhanbad",
    "Amritsar",
    "Navi Mumbai",
    "Allahabad",
    "Howrah",
    "Ranchi",
    "Gwalior",
    "Jabalpur",
    "Coimbatore",
    "Vijayawada",
    "Jodhpur",
    "Madurai",
    "Raipur",
    "Kota",
    "Chandigarh",
    "Guwahati",
    "Solapur",
    "Hubli-Dharwad",
    "Mysore",
    "Tiruchirappalli",
    "Bareilly",
    "Aligarh",
    "Tiruppur",
    "Moradabad",
    "Jalandhar",
    "Bhubaneswar",
    "Salem",
    "Warangal",
    "Guntur",
    "Bhiwandi",
    "Saharanpur",
    "Gorakhpur",
    "Bikaner",
    "Amravati",
    "Noida",
    "Jamshedpur",
    "Bhilai",
    "Cuttack",
    "Firozabad",
    "Kochi",
    "Nellore",
    "Bhavnagar",
    "Dehradun",
    "Durgapur",
    "Asansol",
    "Rourkela",
    "Nanded",
    "Kolhapur",
    "Ajmer",
    "Akola",
    "Gulbarga",
    "Jamnagar",
    "Ujjain",
    "Loni",
    "Siliguri",
    "Jhansi",
    "Ulhasnagar",
    "Jammu",
    "Sangli-Miraj & Kupwad",
    "Mangalore",
    "Erode",
    "Belgaum",
    "Ambattur",
    "Tirunelveli",
    "Malegaon",
    "Gaya",
    "Jalgaon",
    "Udaipur",
    "Maheshtala",
  ],
};

const countries = {
  countries: [
    "India",
    "United States",
    "China",
    "Japan",
    "Germany",
    "United Kingdom",
    "France",
    "Italy",
    "Brazil",
    "Canada",
    "Russia",
    "South Korea",
    "Australia",
    "Spain",
    "Mexico",
    "Indonesia",
    "Netherlands",
    "Saudi Arabia",
    "Turkey",
    "Switzerland",
    "Argentina",
    "Sweden",
    "Poland",
    "Belgium",
    "Thailand",
    "Iran",
    "Austria",
    "Norway",
    "United Arab Emirates",
    "Israel",
    "South Africa",
    "Denmark",
    "Singapore",
    "Malaysia",
    "Ireland",
    "Philippines",
    "Pakistan",
    "Chile",
    "Finland",
    "Portugal",
    "Greece",
    "Vietnam",
    "New Zealand",
    "Czech Republic",
    "Romania",
    "Hungary",
    "Kazakhstan",
    "Peru",
    "Iraq",
    "Qatar",
    "Bangladesh",
    "Kuwait",
    "Morocco",
    "Slovakia",
    "Angola",
    "Ecuador",
    "Sudan",
    "Sri Lanka",
    "Myanmar",
    "Oman",
    "Panama",
    "Uzbekistan",
    "Luxembourg",
    "Croatia",
    "Bahrain",
    "Ivory Coast",
    "Cameroon",
    "Nepal",
    "Uruguay",
    "Mongolia",
    "Paraguay",
    "Bolivia",
    "Trinidad and Tobago",
    "Afghanistan",
    "Estonia",
    "Cyprus",
    "Iceland",
    "Montenegro",
    "Malta",
    "Bhutan",
    "Barbados",
    "Brunei",
    "Belize",
    "Seychelles",
    "Saint Kitts and Nevis",
    "Liechtenstein",
    "Monaco",
    "San Marino",
    "Andorra",
    "Palau",
    "Marshall Islands",
  ],
};

const banks = {
  banks: [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "IndusInd Bank",
    "Yes Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "Bank of India",
    "Indian Bank",
    "Central Bank of India",
    "IDBI Bank",
    "UCO Bank",
    "Indian Overseas Bank",
    "Bank of Maharashtra",
    "Punjab & Sind Bank",
    "Federal Bank",
    "South Indian Bank",
    "RBL Bank",
    "Karnataka Bank",
    "City Union Bank",
    "Karur Vysya Bank",
    "DCB Bank",
    "Tamilnad Mercantile Bank",
    "IDFC First Bank",
    "Jammu & Kashmir Bank",
    "Suryoday Small Finance Bank",
    "Ujjivan Small Finance Bank",
    "Equitas Small Finance Bank",
    "AU Small Finance Bank",
    "Bandhan Bank",
    "Dhanlaxmi Bank",
    "Nainital Bank",
    "North East Small Finance Bank",
    "ESAFF Small Finance Bank",
    "Fincare Small Finance Bank",
  ],
};

export default class EmployeeAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fistname: "",
      lastname: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      fathername: "",
      idNumber: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
      iBan: "",
      address: "",
      country: "",
      city: "",
      mobile: null,
      phone: null,
      email: "",
      username: "",
      password: "",
      role: "",
      department: "",
      departmentId: null,
      startDate: "",
      endDate: "",
      departments: [],
      jobTitle: null,
      joiningDate: "",
      file: null,
      hasError: false,
      errMsg: "",
      completed: false,
      uploadStatus: "",
      employmentType: "",
      file: null,
      paySlips: [],
      hikeLetter: null,
      relievingLetter: null,
      resignationLetter: null,
    };
  }

  componentDidMount() {
    axios.defaults.baseURL = API_BASE_URL;
    axios({
      method: "get",
      url: "/api/departments",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ departments: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  fileSelectedHandler = (event) => {
    this.setState({
      file: event.target.files[0],
    });
  };
  handleFileChange = (type) => (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (type === "paySlips") {
      this.setState({ paySlips: selectedFiles });
    } else {
      this.setState({ [type]: selectedFiles[0] });
    }
  };

  onSubmit = (e) => {
    this.setState({ hasError: false, errorMsg: "", completed: false });

    let user = {
      username: this.state.username,
      password: this.state.password,
      fullname: this.state.fistname + " " + this.state.lastname,
      role: this.state.role,
      departmentId: this.state.departmentId,
      active: 1,
    };

    e.preventDefault();
    axios.defaults.baseURL = API_BASE_URL;
    axios({
      method: "post",
      url: "/api/users",
      data: user,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        let userId = res.data.id;

        let userPersonalInfo = {
          dateOfBirth: this.state.dateOfBirth,
          gender: this.state.gender,
          maritalStatus: this.state.maritalStatus,
          fatherName: this.state.fathername,
          idNumber: this.state.idNumber,
          address: this.state.address,
          city: this.state.city,
          country: this.state.country,
          mobile: this.state.mobile,
          phone: this.state.phone,
          emailAddress: this.state.email,
          userId: userId,
        };

        axios.defaults.baseURL = API_BASE_URL;
        axios({
          method: "post",
          url: "/api/personalInformations",
          data: userPersonalInfo,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => {
            let userFinancialInfo = {
              bankName: this.state.bankName,
              accountName: this.state.accountName,
              accountNumber: this.state.accountNumber,
              iban: this.state.iBan,
              userId: userId,
            };

            axios.defaults.baseURL = API_BASE_URL;
            axios({
              method: "post",
              url: "api/financialInformations",
              data: userFinancialInfo,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
              .then((res) => {
                let job = {
                  jobTitle: this.state.jobTitle,
                  startDate: this.state.startDate,
                  employmentType: this.state.employmentType,
                  userId: userId,
                  file: this.state.file,
                };
                axios.defaults.baseURL = API_BASE_URL;
                axios({
                  method: "post",
                  url: "api/jobs/",
                  data: job,
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                })
                  .then((res) => {
                    this.setState({ completed: true });
                    window.scrollTo(0, 0);
                  })
                  .catch((err) => {
                    this.setState({
                      hasError: true,
                      errMsg: err.response.data.message,
                    });
                    window.scrollTo(0, 0);
                  });
              })
              .catch((err) => {
                this.setState({
                  hasError: true,
                  errMsg: err.response.data.message,
                });
                window.scrollTo(0, 0);
              });
          })
          .catch((err) => {
            this.setState({
              hasError: true,
              errMsg: err.response.data.message,
            });
            window.scrollTo(0, 0);
          });
      })
      .catch((err) => {
        this.setState({ hasError: true, errMsg: err.response.data.message });
        window.scrollTo(0, 0);
      });
  };

  pushDepartments = () => {
    let items = [];
    this.state.departments.map((dept, index) => {
      items.push(
        <option key={index} value={dept.id}>
          {dept.departmentName}
        </option>
      );
    });
    return items;
  };
  handleUpload = async (event) => {
    event.preventDefault();
    if (!this.state.file) {
      this.setState({ uploadStatus: "No file selected" });
      return;
    }

    const formData = new FormData();
    formData.append("file", this.state.file);

    try {
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      this.setState({
        uploadStatus: `File uploaded successfully: ${response.data.filePath}`,
      });
    } catch (error) {
      this.setState({ uploadStatus: "File upload failed" });
    }
  };
  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <div className="row">
          {this.state.hasError ? (
            <Alert variant="danger" className="m-3" block>
              {this.state.errMsg}
            </Alert>
          ) : this.state.completed ? (
            <Alert variant="success" className="m-3" block>
              Employee has been inserted.
            </Alert>
          ) : (
            <></>
          )}

          {/* Main Card */}
          <Card className="col-sm-12 main-card">
            <Card.Header>
              <b>Add Employee</b>
            </Card.Header>
            <Card.Body>
              <div className="row">
                {/* Personal Details Card */}
                <div className="col-sm-6">
                  <Card className="secondary-card">
                    <Card.Header>Personal Details</Card.Header>
                    <Card.Body>
                      <div>
                        <Form.Group controlId="formFirstName">
                          <Form.Label className="text-muted required">
                            First Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter first Name"
                            name="fistname"
                            value={this.state.fistname}
                            onChange={this.handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group controlId="formLastName">
                          <Form.Label className="text-muted required">
                            Last Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter last Name"
                            name="lastname"
                            value={this.state.lastname}
                            onChange={this.handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group controlId="formDateofBirth">
                          <Form.Label className="text-muted required">
                            Date of Birth
                          </Form.Label>
                          <Form.Row>
                            <DatePicker
                              selected={this.state.dateOfBirth}
                              onChange={(dateOfBirth) =>
                                this.setState({ dateOfBirth })
                              }
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              timeFormat="HH:mm"
                              name="dateOfBirth"
                              timeIntervals={30}
                              timeCaption="time"
                              dateFormat="yyyy-MM-dd"
                              className="form-control ml-1"
                              placeholderText="Select Date Of Birth"
                              autoComplete="off"
                              required
                            />
                          </Form.Row>
                        </Form.Group>

                        <Form.Group controlId="formGender">
                          <Form.Label className="text-muted required">
                            Gender
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={this.state.gender}
                            onChange={this.handleChange}
                            name="gender"
                            required
                          >
                            <option value="">Choose...</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formMaritalStatus">
                          <Form.Label className="text-muted required">
                            Marital Status
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={this.state.maritalStatus}
                            onChange={this.handleChange}
                            name="maritalStatus"
                            required
                          >
                            <option value="">Choose...</option>
                            <option value="married">Married</option>
                            <option value="single">Single</option>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formFatherName">
                          <Form.Label className="text-muted required">
                            Father's name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Father's Name"
                            name="fathername"
                            value={this.state.fathername}
                            onChange={this.handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group controlId="formId">
                          <Form.Label className="text-muted required">
                            ID Number
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter ID Number"
                            name="idNumber"
                            value={this.state.idNumber}
                            onChange={this.handleChange}
                            required
                          />
                        </Form.Group>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-sm-6">
                  <Card className="secondary-card">
                    <Card.Header>Contact Details</Card.Header>
                    <Card.Body>
                      <div>
                        <Form.Group controlId="formPhysicalAddress">
                          <Form.Label className="text-muted required">
                            Current Address
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.address}
                            onChange={this.handleChange}
                            name="address"
                            placeholder="Enter Address"
                            required
                          />
                        </Form.Group>
                        {/* <Form.Group controlId="formCountry">
                          <Form.Label className="text-muted required">
                            Country
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.country}
                            onChange={this.handleChange}
                            name="country"
                            placeholder="Enter Country"
                            required
                          />
                        </Form.Group> */}
                        <Form.Group controlId="formCountry">
                          <Form.Label className="text-muted required">
                            Country
                          </Form.Label>
                          <Form.Control
                            type="text"
                            list="countryOptions"
                            value={this.state.country}
                            onChange={this.handleChange}
                            name="country"
                            placeholder="Enter Country"
                            required
                          />
                          <datalist id="countryOptions">
                            {countries.countries.map((country, index) => (
                              <option key={index} value={country} />
                            ))}
                          </datalist>
                        </Form.Group>
                        {/* <Form.Group controlId="formCity">
                          <Form.Label className="text-muted required">
                            City
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.city}
                            onChange={this.handleChange}
                            name="city"
                            placeholder="Enter City"
                            required
                          />
                        </Form.Group> */}
                        <Form.Group controlId="formCity">
                          <Form.Label className="text-muted required">
                            City
                          </Form.Label>
                          <Form.Control
                            type="text"
                            list="cityOptions"
                            value={this.state.city}
                            onChange={this.handleChange}
                            name="city"
                            placeholder="Enter City"
                            required
                          />
                          <datalist id="cityOptions">
                            {cities.cities.map((city, index) => (
                              <option key={index} value={city} />
                            ))}
                          </datalist>
                        </Form.Group>
                        <Form.Group controlId="formMobile">
                          <Form.Label className="text-muted required">
                            Mobile
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.mobile}
                            onChange={this.handleChange}
                            name="mobile"
                            placeholder="Enter Mobile"
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                          <Form.Label className="text-muted">Phone</Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.phone}
                            onChange={this.handleChange}
                            name="phone"
                            placeholder="Enter Phone"
                          />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                          <Form.Label className="text-muted required">
                            Email
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.email}
                            onChange={this.handleChange}
                            name="email"
                            placeholder="Enter Email"
                            required
                          />
                        </Form.Group>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <Card className="secondary-card">
                    <Card.Header>Bank Information</Card.Header>
                    <Card.Body>
                      <div>
                        <Form.Group controlId="formBankName">
                          <Form.Label className="text-muted">
                            Bank Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            list="bankOptions"
                            value={this.state.bankName}
                            onChange={this.handleChange}
                            name="bankName"
                            placeholder="Enter Bank name"
                          />
                          <datalist id="bankOptions">
                            {banks.banks.map((bank, index) => (
                              <option key={index} value={bank} />
                            ))}
                          </datalist>
                        </Form.Group>
                        <Form.Group controlId="formAccountName">
                          <Form.Label className="text-muted">
                            Account Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.accountName}
                            onChange={this.handleChange}
                            name="accountName"
                            placeholder="Enter Account name"
                          />
                        </Form.Group>
                        <Form.Group controlId="formAccountNumber">
                          <Form.Label className="text-muted">
                            Account Number
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.accountNumber}
                            onChange={this.handleChange}
                            name="accountNumber"
                            placeholder="Enter Account number"
                          />
                        </Form.Group>
                        <Form.Group controlId="formIban">
                          <Form.Label className="text-muted">iBan</Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.iBan}
                            onChange={this.handleChange}
                            name="iBan"
                            placeholder="Enter Iban"
                          />
                        </Form.Group>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-sm-6">
                  <Card className="secondary-card">
                    <Card.Header>Official Status</Card.Header>
                    <Card.Body>
                      <div>
                        <Form.Group controlId="formEmployeeId">
                          <Form.Label className="text-muted required">
                            Employee ID
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.username}
                            onChange={this.handleChange}
                            name="username"
                            placeholder="Enter Username"
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                          <Form.Label className="text-muted required">
                            Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            name="password"
                            placeholder="Enter Password"
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="formDepartment">
                          <Form.Label className="text-muted required">
                            Department
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={this.state.departmentId}
                            onChange={this.handleChange}
                            name="departmentId"
                            required
                          >
                            <option value="" defaultValue>
                              Choose...
                            </option>
                            {this.pushDepartments()}
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formRole">
                          <Form.Label className="text-muted required">
                            Role
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={this.state.role}
                            onChange={this.handleChange}
                            name="role"
                            required
                          >
                            <option value="">Choose...</option>
                            <option value="ROLE_ADMIN">Admin</option>
                            <option value="ROLE_MANAGER">Manager</option>
                            <option value="ROLE_EMPLOYEE">Employee</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <Card className="secondary-card">
                    <Card.Header>Job</Card.Header>
                    <Card.Body>
                      <div>
                        <Form.Group controlId="formJobTitle">
                          <Form.Label className="text-muted required">
                            Job Title
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.jobTitle}
                            onChange={this.handleChange}
                            name="jobTitle"
                            placeholder="Enter Job Title"
                          />
                        </Form.Group>
                        <Form.Group controlId="formJobStart">
                          <Form.Label className="text-muted required">
                            Start Date
                          </Form.Label>
                          <Form.Row>
                            <DatePicker
                              selected={this.state.startDate}
                              onChange={(startDate) =>
                                this.setState({ startDate })
                              }
                              dropdownMode="select"
                              timeFormat="HH:mm"
                              name="startDate"
                              timeCaption="time"
                              dateFormat="yyyy-MM-dd"
                              className="form-control ml-1"
                              placeholderText="Select Date Of Birth"
                              autoComplete="off"
                              required
                            />
                          </Form.Row>
                        </Form.Group>
                        <Form.Group controlId="formEmploymentType">
                          <Form.Label className="text-muted">
                            Employment Type
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={this.state.employmentType}
                            onChange={this.handleChange}
                            name="employmentType"
                          >
                            <option value="">Select Employment Type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                          </Form.Control>
                        </Form.Group>
                        {/* <Form.Group controlId="formJobEnd">
                          <Form.Label className="text-muted required">
                            End Date
                          </Form.Label>
                          <Form.Row>
                            <DatePicker
                              selected={this.state.endDate}
                              onChange={(endDate) => this.setState({ endDate })}
                              dropdownMode="select"
                              timeFormat="HH:mm"
                              name="endDate"
                              timeCaption="time"
                              dateFormat="yyyy-MM-dd"
                              className="form-control ml-1"
                              placeholderText="Select Date Of Birth"
                              autoComplete="off"
                            />
                          </Form.Row>
                        </Form.Group> */}
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                {/* <div className="row"> */}
                <div className="col-sm-6">
                  {/* <Card className="secondary-card">
                    <Card.Header>Upload Offer Letter</Card.Header>
                    <Card.Body>
                      <Form.Group controlId="formFileOffer">
                        <Form.Label className="text-muted">
                          Upload File
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="offerLetter"
                          onChange={(e) =>
                            this.handleFileChange("offerLetter", e)
                          }
                          // required
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card> */}
                  {/* <Card className="secondary-card">
                    <Card.Header>Upload Salary Slips</Card.Header>
                    <Card.Body>
                      <Form.Group controlId="formFileSalarySlips">
                        <Form.Label className="text-muted">
                          Upload File(s)
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="salarySlips"
                          onChange={(e) =>
                            this.handleFileChange("salarySlips", e)
                          }
                          multiple
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card> */}
                </div>
                <div className="col-sm-6">
                  {/* <Card className="secondary-card">
                    <Card.Header>Upload Hike Letter</Card.Header>
                    <Card.Body>
                      <Form.Group controlId="formFileHike">
                        <Form.Label className="text-muted">
                          Upload File
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="hikeLetter"
                          onChange={(e) =>
                            this.handleFileChange("hikeLetter", e)
                          }
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card> */}
                  {/* <Card className="secondary-card">
                    <Card.Header>Upload Relieving Letter</Card.Header>
                    <Card.Body>
                      <Form.Group controlId="formFileRelieving">
                        <Form.Label className="text-muted">
                          Upload File
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="relievingLetter"
                          onChange={(e) =>
                            this.handleFileChange("relievingLetter", e)
                          }
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card> */}
                </div>
                <div className="col-sm-6">
                  {/* <Card className="secondary-card">
                    <Card.Header>Upload Resignation Letter</Card.Header>
                    <Card.Body>
                      <Form.Group controlId="formFileResignation">
                        <Form.Label className="text-muted">
                          Upload File
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="resignationLetter"
                          onChange={(e) =>
                            this.handleFileChange("resignationLetter", e)
                          }
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card> */}
                  <Button variant="primary" type="submit" block>
                    Submit
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Form>
    );
  }
}
