// EmployeeStyledComponents.js
import styled, { ThemeProvider } from "styled-components";

export const theme = {
  colors: {
    primary: "#ffffff",
    secondary: "#ffffff",
    background: "#ffffff",
    text: "black",
    lightText: "#666666",
    cardHeader: "#006400",
    cardBody: "#ffffff  ",
  },
  gradients: {
    primary: "#a7a4a4",
    secondary: "#8adcd2",
    cardHeader: "#8adcd2",
  },
  fontSizes: {
    small: "0.875rem",
    medium: "1rem",
    large: "1.25rem",
    xlarge: "1.5rem",
  },
};

export const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  // padding: 2rem;
  padding-top: 0.9rem;
  font-family: Arial, sans-serif;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

export const DashboardTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const CardContainer = styled.div`
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
  height: 100%;
`;

export const CardHeader = styled.div`
  background: ${({ theme }) => theme.gradients.cardHeader};
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.background};
  margin: 0;
`;

export const CardBody = styled.div`
  background: ${({ theme }) => theme.colors.cardBody};
  padding: 1rem;
  height: calc(100% - 3.5rem);
  overflow-y: auto;
`;

export const DataItemContainer = styled.p`
  margin: 0.5rem 0;
`;

export const DataItemLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.lightText};
  display: block;
`;

export const DataItemValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

export const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ProfileImage = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradients.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: bold;
`;

export const ProfileDetails = styled.div`
  h2 {
    font-size: ${({ theme }) => theme.fontSizes.large};
    font-weight: bold;
    margin: 0 0 0.5rem 0;
    color: ${({ theme }) => theme.colors.text};
  }
  p {
    margin: 0 0 0.25rem 0;
    color: ${({ theme }) => theme.colors.lightText};
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

export const FlexItem = styled.div`
  flex: 1 1 ${({ fullWidth }) => (fullWidth ? "100%" : "calc(50% - 0.75rem)")};
  min-width: 300px;
`;
