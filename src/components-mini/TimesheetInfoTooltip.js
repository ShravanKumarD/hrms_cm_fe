import React, { useState } from "react";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import styled from "styled-components";

const CustomTooltip = styled(Tooltip)`
  .tooltip-inner {
    max-width: 400px;
    width: max-content;
    text-align: left;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  td {
    border: 1px solid rgba(0, 0, 0, 0.2);
    text-align: left;
    font-size: 0.9rem;
    padding: 5px;
  }

  .color-box {
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }
`;

const TimesheetTooltip = ({ placement = "left" }) => {
  const [show, setShow] = useState(false);

  function getWorkStatusAndColor(status, applicationType = "") {
    let workStatus = "Less than Half Day";
    let backgroundColor = "rgba(255, 255, 0, 0.4)"; // Default color for "Less than Half Day"

    switch (status) {
      case "Overtime":
        workStatus = "Overtime";
        backgroundColor = "rgba(0, 100, 0, 0.6)"; // Darker green for overtime
        break;
      case "Full Day":
        workStatus = "Full Day";
        backgroundColor = "rgba(0, 128, 0, 0.4)"; // Green for "Full Day"
        break;
      case "Half Day":
        workStatus = "Half Day";
        backgroundColor = "rgba(144, 238, 144, 0.4)"; // Leafy green for "Half Day"
        break;
      case "Absent":
        workStatus = "Absent";
        backgroundColor = "rgba(255, 99, 71, 0.4)"; // Tomato red for "Absent"
        break;
      case "Leave":
        workStatus = "Leave";
        backgroundColor = "rgba(173, 216, 230, 0.4)"; // Light blue for "Leave"
        break;
      case "Pending":
        workStatus = `Requested`;
        backgroundColor = "rgba(255, 165, 0, 0.4)"; // Orange for "Pending"
        break;
      case "Approved":
        workStatus = `Approved`;
        backgroundColor = "rgba(0, 128, 0, 0.4)"; // Green for "Approved"
        break;
      default:
        break;
    }

    return { workStatus, backgroundColor };
  }

  const workStatusData = [
    getWorkStatusAndColor("Absent"),
    getWorkStatusAndColor("Leave"),
    getWorkStatusAndColor("Half Day"),
    getWorkStatusAndColor("Full Day"),
    getWorkStatusAndColor("Overtime"),
    getWorkStatusAndColor("Pending"),
    getWorkStatusAndColor("Approved"),
  ];

  const handleMouseEnter = () => setShow(true);
  const handleMouseLeave = () => setShow(false);

  const renderTooltip = (props) => (
    <CustomTooltip
      id="timesheet-tooltip"
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <StyledTable className="table table-sm">
        <tbody>
          {workStatusData.map(({ workStatus, backgroundColor }, index) => (
            <tr key={index}>
              <td>
                <div className="color-box" style={{ backgroundColor }} />
              </td>
              <td dangerouslySetInnerHTML={{ __html: workStatus }} />
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

export default TimesheetTooltip;
