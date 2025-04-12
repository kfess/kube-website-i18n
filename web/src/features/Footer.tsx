import { Anchor, Box, Container, Group, Text } from '@mantine/core';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer">
      <Container>
        <Group pb={40} justify="center">
          <Text c="dimmed" size="xs">
            © {currentYear} Kubernetes Website Translation Dashboard
          </Text>
          <Text c="dimmed" size="xs">
            •
          </Text>
          <Anchor href="#" c="dimmed" size="xs">
            GitHub
          </Anchor>
          <Text c="dimmed" size="xs">
            •
          </Text>
          <Anchor href="#" c="dimmed" size="xs">
            Terms
          </Anchor>
          <Text c="dimmed" size="xs">
            •
          </Text>
          <Anchor href="#" c="dimmed" size="xs">
            Privacy
          </Anchor>
          <Text c="dimmed" size="xs">
            •
          </Text>
          <Anchor href="#" c="dimmed" size="xs">
            Contact
          </Anchor>
        </Group>
      </Container>
    </Box>
  );
};
