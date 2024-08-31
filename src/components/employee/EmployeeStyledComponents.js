import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

export const ProfileCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

export const ProfileHeader = styled.h2`
  background-color: #515e73;
  color: white;
  padding: 1rem;
  margin: 0;
`;

export const ProfileContent = styled.div`
  display: flex;
  padding: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ProfileImage = styled.div`
  flex: 0 0 150px;
  margin-right: 2rem;
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

export const UserImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 50%;
`;

export const ProfileDetails = styled.div`
  flex: 1;
`;

export const ProfileList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const InfoCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

export const InfoCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;

  h3 {
    margin-top: 0;
    color: #515e73;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;