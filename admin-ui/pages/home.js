/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Container } from '@arch-ui/layout';
import { useQuery } from 'react-apollo';
import { Card } from '@arch-ui/card';
import { Title, H1, SubtleText, Truncate } from '@arch-ui/typography';

import gql from 'graphql-tag';
import { useHistory } from 'react-router-dom';
const QUERY_EXPIRING_DOMAINS = gql`
query {
  allDomains(first: 5, orderBy: "registryExpiryDate") {
    id name registryCreationDate registryExpiryDate registryUpdatedDate expiresIn registrationAge
  }
}
`;
const Dashboard = () => {
  const { data: { allDomains = [] } = {}, error: domainError, loading: domainsLoading } = useQuery(
    QUERY_EXPIRING_DOMAINS
  );

  const history = useHistory();

  return (
    <Container>
      <Title as="h1" margin="both">
        Home
      </Title>
      <p>First 5 domains expiring next</p>
      <div
        css={{
          display: 'flex',
          flexFlow: 'row wrap',
          // justifyContent: 'space-around'
        }}
      >
        {allDomains.map(({ id, name, expiresIn, registrationAge }) => (
          <Card
            css={{ display: 'inline', margin: '1rem', cursor: 'pointer' }}
            isInteractive
            key={id}
            onClick={() => history.push(`/admin/domains/${id}`)}
          >
            <Title>{name}</Title>
            <SubtleText>{registrationAge} old</SubtleText>
            <br />
            <p>expires in {expiresIn}</p>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default Dashboard;
