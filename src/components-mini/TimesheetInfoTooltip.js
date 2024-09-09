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

  // Function to handle work status and background color based on the status type
  function getWorkStatusAndColor(status, applicationType = "") {
    let workStatus = "Unknown Status"; // Default unknown status for invalid or unhandled cases
    let backgroundColor = "rgba(128, 128, 128, 0.4)"; // Default grey color for unknown status

    // Validate if status is provided and is a string
    if (typeof status !== "string" || status.trim() === "") {
      console.warn(`Invalid status provided: "${status}"`);
      return { workStatus, backgroundColor }; // Return default values
    }

    // Handling work statuses and their respective colors
    switch (status) {
      case "Overtime":
        workStatus = "Overtime";
        backgroundColor = "rgba(0, 100, 0, 0.6)"; // Darker green for overtime
        break;
      case "Full Day":
        workStatus = "Full Day";
        backgroundColor = "rgba(0, 128, 0, 0.4)"; // Green for full day
        break;
      case "Partial Day":
        workStatus = "Partial Day";
        backgroundColor = "rgba(144, 238, 144, 0.4)"; // Light green for half day
        break;
      case "Absent":
        workStatus = "Absent";
        backgroundColor = "rgba(255, 99, 71, 0.4)"; // Tomato red for absent
        break;
      case "Leave":
        workStatus = "Leave";
        backgroundColor = "rgba(173, 216, 230, 0.4)"; // Light blue for leave
        break;
      case "Pending":
        workStatus = `Requested`;
        backgroundColor = "rgba(255, 165, 0, 0.4)"; // Orange for pending
        break;
      case "Approved":
        workStatus = `Approved`;
        backgroundColor = "rgba(0, 128, 0, 0.4)"; // Green for approved
        break;
      default:
        console.warn(`Unhandled status: "${status}"`); // Log for any unhandled case
        break;
    }

    return { workStatus, backgroundColor };
  }

  // Work status data array, ensuring all cases are handled properly
  const workStatusData = [
    getWorkStatusAndColor("Absent"),
    getWorkStatusAndColor("Leave"),
    getWorkStatusAndColor("Half Day"),
    getWorkStatusAndColor("Full Day"),
    getWorkStatusAndColor("Overtime"),
    getWorkStatusAndColor("Pending"),
    getWorkStatusAndColor("Approved"),
  ].filter(data => data.workStatus !== "Unknown Status"); // Filter out any invalid data

  // Ensure there is valid data to display
  if (workStatusData.length === 0) {
    console.warn("No valid work status data available for display.");
  }

  const handleMouseEnter = () => setShow(true);
  const handleMouseLeave = () => setShow(false);

  const renderTooltip = (props) => (
    <CustomTooltip
      id="timesheet-tooltip"
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {workStatusData.length > 0 ? (
        <StyledTable className="table table-sm">
          <tbody>
            {workStatusData.map(({ workStatus, backgroundColor }, index) => (
              <tr key={index}>
                <td>
                  <div className="color-box" style={{ backgroundColor }} />
                </td>
                <td>{workStatus}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      ) : (
        <p>No data available to display</p> // Fallback when no valid data is available
      )}
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
