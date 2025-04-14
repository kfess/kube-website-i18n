import { Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={20}>
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: '#326ce5', to: '#94c6ff' }}
        >
          Kubernetes Localization Status
        </Text>
      </Title>
    </>
  );
}
