import * as React from "react";
import axios from "axios";
import API_BASE_URL from "../env";
import { Card } from "react-bootstrap";
import styled from "styled-components";

const theme = {
  approvedColor: "#4CAF50", // Green for approved
  rejectedColor: "#F44336", // Red for rejected
  pendingColor: "#FF9800",  // Orange for pending
  textColor: "#212121",
  borderColor: "#E0E0E0",
  cardBackgroundColor: "#F5F5F5", // Light grey background for cards
};

const Header = styled.h3`
  margin: 0;
  padding-bottom: 10px;
  font-size: 18px;
  color: ${theme.textColor};
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ApplicationCard = styled(Card)`
  border: 1px solid ${theme.borderColor};
  background-color: ${theme.cardBackgroundColor};
  padding: 15px;
  margin-bottom: 15px;
  width: 100%;
  max-width: 600px; /* Adjust width as needed */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserImage = styled.img`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 15px;
`;

const StatusText = styled.small`
  color: ${props => props.color};
  font-weight: bold;
`;

export default class RecentApplications extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      recentApplications: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;
    // Fetch Recent Applications
    axios.defaults.baseURL = API_BASE_URL;
    axios.get("/api/applications/recent", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      if (this._isMounted) {
        this.setState({ recentApplications: res.data });
      }
    })
    .catch((err) => {
      console.error("Error fetching recent applications:", err);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <Container>
        <Header>Leave Applications</Header>
        <div style={{ width: '100%' }}>
          {this.state.recentApplications.map((app) => (
            <ApplicationCard key={app.id}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <UserImage src={process.env.PUBLIC_URL + "/user-40.png"} alt="User" />
                <div>
                  <h5>
                    <span>{app.user.fullName} </span>
                    <small>({app.type})</small>
                  </h5>
                  <StatusText
                    color={
                      app.status === "Approved"
                        ? theme.approvedColor
                        : app.status === "Rejected"
                        ? theme.rejectedColor
                        : theme.pendingColor
                    }
                  >
                    {app.status}
                  </StatusText>
                </div>
              </div>
            </ApplicationCard>
          ))}
        </div>
      </Container>
    );
  }
}
