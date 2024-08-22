import React, { Component } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

export default class SalaryDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departments: [],
            selectedDepartment: "",
            selectedUser: "",
            financialId: null,
            users: [],
            employmentType: "",
            salaryBasic: 0,
            allowanceHouseRent: 0,
            allowanceMedical: 0,
            allowanceSpecial: 0,
            allowanceFuel: 0,
            allowanceOther: 0,
            deductionTax: 0,
            deductionOther: 0,
            pf: 0,
            pt: 0,
            tds: 0,
            hasError: false,
            errMsg: "",
            completed: false,
        };
    }

    componentDidMount() {
        axios.get('/api/departments', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => {
            this.setState({ departments: res.data }, () => {
                const { location } = this.props;
                if (location.state) {
                    this.setState({
                        selectedDepartment: location.state.selectedUser.departmentId,
                        selectedUser: location.state.selectedUser.id
                    }, this.fetchData);
                }
            });
        })
        .catch(err => {
            console.error(err);
        });
    }

    fetchData = () => {
        const { selectedDepartment } = this.state;
        axios.get(`/api/departments/${selectedDepartment}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => {
            const users = res.data.users || [];
            this.setState({ users });
        })
        .catch(err => {
            console.error(err);
        });
    }

    fetchDataAll = () => {
        axios.get('/api/departments', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => {
            let users = [];
            res.data.forEach(dept => {
                users = [...users, ...dept.users];
            });
            this.setState({ users });
        })
        .catch(err => {
            console.error(err);
        });
    }

    handleDepartmentChange = (event) => {
        const selectedDepartment = event.target.value;
        this.setState({ selectedDepartment }, () => {
            if (selectedDepartment === "all") {
                this.fetchDataAll();
            } else {
                this.fetchData();
            }
        });
    }

    handleUserChange = (event) => {
        const selectedUser = event.target.value;
        this.setState({ selectedUser }, () => {
            if (selectedUser) {
                axios.get(`/api/financialInformations/user/${selectedUser}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(res => {
                    const financialData = res.data[0] || {};
                    this.setState({
                        financialId: financialData.id,
                        ...financialData
                    });
                })
                .catch(err => {
                    console.error(err);
                });
            }
        });
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        const numericValue = name === "employmentType" ? value : parseFloat(value) || 0;
        this.setState({ [name]: numericValue });
    };

    calculateSalaryDetails = () => {
        const { salaryBasic, allowanceHouseRent, allowanceMedical, allowanceSpecial, allowanceFuel, allowanceOther, deductionTax, deductionOther, pf, pt, tds } = this.state;
        const allowanceTotal = allowanceHouseRent + allowanceMedical + allowanceSpecial + allowanceFuel + allowanceOther;
        const deductionTotal = deductionTax + deductionOther + pf + pt + tds;
        const salaryGross = salaryBasic + allowanceTotal;
        const salaryNet = salaryGross - deductionTotal;

        return { salaryGross, deductionTotal, salaryNet };
    }

    onSubmit = (event) => {
        event.preventDefault();

        const { salaryGross, salaryNet } = this.calculateSalaryDetails();

        const data = {
            employmentType: this.state.employmentType,
            salaryBasic: this.state.salaryBasic,
            salaryGross,
            salaryNet,
            allowanceHouseRent: this.state.allowanceHouseRent,
            allowanceMedical: this.state.allowanceMedical,
            allowanceSpecial: this.state.allowanceSpecial,
            allowanceFuel: this.state.allowanceFuel,
            allowanceOther: this.state.allowanceOther,
            deductionTax: this.state.deductionTax,
            deductionOther: this.state.deductionOther,
            pf: this.state.pf,
            pt: this.state.pt,
            tds: this.state.tds
        };

        axios.put(`/api/financialInformations/${this.state.financialId}`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
            this.setState({ completed: true });
            window.scrollTo(0, 0);
        })
        .catch(err => {
            this.setState({ hasError: true, errMsg: err.response?.data?.message || "An error occurred" });
            window.scrollTo(0, 0);
        });
    }

    render() {
        const { salaryGross, deductionTotal, salaryNet } = this.calculateSalaryDetails();
        return (
            <div className="container-fluid pt-2">
                <div className="row">
                    {this.state.hasError && (
                        <Alert variant="danger" className="m-3">
                            {this.state.errMsg}
                        </Alert>
                    )}
                    {this.state.completed && (
                        <Alert variant="success" className="m-3">
                            Financial Information has been updated.
                        </Alert>
                    )}

                    <div className="col-sm-12">
                        <Card className="main-card">
                            <Card.Header>Manage Salary Details</Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Select Department:</Form.Label>
                                        <Form.Control as="select" value={this.state.selectedDepartment} onChange={this.handleDepartmentChange}>
                                            <option value="">Choose one...</option>
                                            <option value="all">All departments</option>
                                            {this.state.departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Select User:</Form.Label>
                                        <Form.Control as="select" value={this.state.selectedUser} onChange={this.handleUserChange}>
                                            <option value="">Choose one...</option>
                                            {this.state.users.map(user => (
                                                <option key={user.id} value={user.id}>{user.fullName}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>

                {this.state.selectedUser && (
                    <Form onSubmit={this.onSubmit}>
                        <div className="row">
                            <div className="col-sm-12">
                                <Card className="main-card">
                                    <Card.Header>Salary Details</Card.Header>
                                    <Card.Body>
                                        <Form.Group>
                                            <Form.Label className="required">Employment Type</Form.Label>
                                            <Form.Control as="select" value={this.state.employmentType} onChange={this.handleChange} name="employmentType">
                                                <option value="">Choose one...</option>
                                                <option value="Full Time">Full Time</option>
                                                <option value="Part Time">Part Time</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="required">Basic Salary</Form.Label>
                                            <Form.Control type="text" value={this.state.salaryBasic} onChange={this.handleChange} name="salaryBasic" />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <Card className="main-card">
                                    <Card.Header>Allowances</Card.Header>
                                    <Card.Body>
                                        <Form.Group>
                                            <Form.Label>House Rent Allowance</Form.Label>
                                            <Form.Control type="text" value={this.state.allowanceHouseRent} onChange={this.handleChange} name="allowanceHouseRent" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Medical Allowance</Form.Label>
                                            <Form.Control type="text" value={this.state.allowanceMedical} onChange={this.handleChange} name="allowanceMedical" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Special Allowance</Form.Label>
                                            <Form.Control type="text" value={this.state.allowanceSpecial} onChange={this.handleChange} name="allowanceSpecial" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Conveyance Allowance</Form.Label>
                                            <Form.Control type="text" value={this.state.allowanceFuel} onChange={this.handleChange} name="allowanceFuel" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Other Allowance</Form.Label>
                                            <Form.Control type="text" value={this.state.allowanceOther} onChange={this.handleChange} name="allowanceOther" />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="col-sm-6">
                                <Card className="main-card">
                                    <Card.Header>Deductions</Card.Header>
                                    <Card.Body>
                                        <Form.Group>
                                            <Form.Label>Tax Deduction</Form.Label>
                                            <Form.Control type="text" value={this.state.deductionTax} onChange={this.handleChange} name="deductionTax" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Provident Fund</Form.Label>
                                            <Form.Control type="text" value={this.state.pf} onChange={this.handleChange} name="pf" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Professional Tax</Form.Label>
                                            <Form.Control type="text" value={this.state.pt} onChange={this.handleChange} name="pt" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Tax Deducted at Source (TDS)</Form.Label>
                                            <Form.Control type="text" value={this.state.tds} onChange={this.handleChange} name="tds" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Other Deduction</Form.Label>
                                            <Form.Control type="text" value={this.state.deductionOther} onChange={this.handleChange} name="deductionOther" />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <Card className="main-card">
                                    <Card.Header>Salary Summary</Card.Header>
                                    <Card.Body>
                                        <Form.Group>
                                            <Form.Label>Gross Salary</Form.Label>
                                            <Form.Control type="text" readOnly value={salaryGross} />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Total Deductions</Form.Label>
                                            <Form.Control type="text" readOnly value={deductionTotal} />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Net Salary</Form.Label>
                                            <Form.Control type="text" readOnly value={salaryNet} />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 text-center">
                                <Button type="submit">Submit</Button>
                            </div>
                        </div>
                    </Form>
                )}
            </div>
        );
    }
}
