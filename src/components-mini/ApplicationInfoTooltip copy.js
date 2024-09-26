import React, { useState } from "react";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import styled from "styled-components";

const CustomTooltip = styled(Tooltip)`
  .tooltip-inner {
    max-width: 400px; // Adjust this value as needed
    width: max-content;
    text-align: left;
    // background-color: white;
    // color: black;
    // border: 1px solid rgba(0, 0, 0, 0.2);
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  td {
    border: 1px solid rgba(0, 0, 0, 0.2); /* Increase the opacity of the table lines */
    left: 0;
    text-align: left;
    font-size: 0.9rem;
  }
`;

const ApplicationInfoTooltip = ({ placement = "left" }) => {
  const [show, setShow] = useState(false);

  const applicationTypes = {
    Leave: "Request time off from work",
    Regularisation: "Correct or update attendance records",
    "Work From Home": "Request to work remotely",
    "On Duty": "Official work outside the office",
    "Comp Off": "Compensatory time off for extra work hours",
    Expense: "Submit expense claims for reimbursement",
    "Restricted Holiday":
      "Optional holidays based on cultural or religious observances",
    "Short Leave": "Brief absence during work hours",
  };

  const handleMouseEnter = () => setShow(true);
  const handleMouseLeave = () => setShow(false);

  const renderTooltip = (props) => (
    <CustomTooltip
      id="application-types-tooltip"
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <StyledTable className="table table-sm">
        <tbody>
          {Object.entries(applicationTypes).map(([type, description]) => (
            <tr key={type}>
              <td>{type}</td>
              <td>{description}</td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </CustomTooltip>
  );

  return (
    <OverlayTrigger
      placement={placement}
      show={show}
      delay={{ show: 250, hide: 1400 }}
      overlay={renderTooltip}
    >
      <Button
        variant="link"
        className="p-0 text-muted"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <i className="fas fa-question-circle" />
      </Button>
    </OverlayTrigger>
  );
};

export default ApplicationInfoTooltip;
