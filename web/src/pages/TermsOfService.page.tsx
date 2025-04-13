import { Anchor, Container, Divider, Group, Stack, Text, Title } from '@mantine/core';

export function TermsOfServicePage() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="sm">
        <Title order={1}>Terms of Service</Title>
        <Group gap="xs">
          <Title order={3} fw={600}>
            Kubernetes Website Translation Dashboard
          </Title>
        </Group>
        <Text c="dimmed" size="sm">
          Last Updated: April 13, 2025
        </Text>

        <Title order={2} mt="sm">
          1. Introduction
        </Title>
        <Text>
          Welcome to the Kubernetes Translation Website (the "Website"), a volunteer-driven
          initiative to track and support the translation status of Kubernetes documentation. These
          Terms of Service ("Terms") govern your access to and use of the Website.
        </Text>
        <Text>
          By accessing or using the Website, you agree to be bound by these Terms. If you disagree
          with any part of the Terms, you may not access the Website.
        </Text>

        <Title order={2} mt="sm">
          2. Service Description
        </Title>
        <Text>The Kubernetes Translation Website is a community resource that:</Text>
        <ul>
          <li>
            <Text>Tracks the translation status of Kubernetes documentation</Text>
          </li>
          <li>
            <Text>Provides insights into translation progress across different languages</Text>
          </li>
          <li>
            <Text>Facilitates collaboration among volunteer translators</Text>
          </li>
          <li>
            <Text>
              Is not officially affiliated with or endorsed by Kubernetes or the Cloud Native
              Computing Foundation
            </Text>
          </li>
        </ul>

        <Title order={2} mt="sm">
          3. User Contributions
        </Title>

        <Title order={3} mt="xs">
          3.1 Translation Contributions
        </Title>
        <Text>Users who contribute translations do so voluntarily and acknowledge that:</Text>
        <ul>
          <li>
            <Text>
              All contributions may be reviewed, edited, or removed at the discretion of site
              administrators
            </Text>
          </li>
          <li>
            <Text>
              Translations should follow the Kubernetes documentation translation guidelines
            </Text>
          </li>
          <li>
            <Text>Contributors retain no ownership rights over contributed translations</Text>
          </li>
        </ul>

        <Title order={3} mt="xs">
          3.2 Website Feedback
        </Title>
        <Text>
          We welcome feedback about the Website's functionality and features. By submitting
          feedback, you grant us the right to use that feedback without restriction.
        </Text>

        <Title order={2} mt="sm">
          4. Disclaimers
        </Title>

        <Title order={3} mt="xs">
          4.1 Volunteer Service
        </Title>
        <Text>
          This Website is maintained by volunteers. We strive for accuracy and reliability but make
          no guarantees regarding:
        </Text>
        <ul>
          <li>
            <Text>Website availability or uptime</Text>
          </li>
          <li>
            <Text>Accuracy of translation status information</Text>
          </li>
          <li>
            <Text>Completeness of data</Text>
          </li>
        </ul>

        <Title order={3} mt="xs">
          4.2 Not Official Kubernetes Documentation
        </Title>
        <Text>
          This Website is not a replacement for official Kubernetes documentation. Users should
          always refer to the official Kubernetes documentation for the most accurate and up-to-date
          information.
        </Text>

        <Title order={2} mt="sm">
          5. Intellectual Property
        </Title>

        <Title order={3} mt="xs">
          5.1 Website Content
        </Title>
        <Text>
          The Website's code, design, and original content are provided under the{' '}
          <Anchor
            href="https://opensource.org/licenses/apache2.0.php"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apache License 2.0
          </Anchor>{' '}
          unless otherwise specified.
        </Text>

        <Title order={3} mt="xs">
          5.2 Kubernetes Documentation
        </Title>
        <Text>
          Kubernetes documentation is owned by the Kubernetes authors and is licensed under{' '}
          <Anchor
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Creative Commons Attribution 4.0 International License (CC BY 4.0)
          </Anchor>
          .
        </Text>

        <Title order={2} mt="sm">
          6. Limitation of Liability
        </Title>
        <Text>
          To the maximum extent permitted by law, the Website administrators and contributors shall
          not be liable for any indirect, incidental, special, consequential, or punitive damages
          resulting from:
        </Text>
        <ul>
          <li>
            <Text>Your use or inability to use the Website</Text>
          </li>
          <li>
            <Text>Any translations or content accessed through the Website</Text>
          </li>
          <li>
            <Text>Any unauthorized access to or use of our servers or any data stored therein</Text>
          </li>
        </ul>

        <Title order={2} mt="sm">
          7. Changes to Terms
        </Title>
        <Text>
          We reserve the right to modify these Terms at any time. We will provide notice of
          significant changes by updating the "Last Updated" date at the top of these Terms. Your
          continued use of the Website after such modifications constitutes your acceptance of the
          revised Terms.
        </Text>

        <Title order={2} mt="sm">
          8. Contact
        </Title>
        <Text>
          If you have any questions about these Terms, please contact the project maintainers via{' '}
          <Anchor
            href="https://github.com/kfess/kube-website-i18n/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Issues
          </Anchor>
          .
        </Text>

        <Divider my="xl" />

        <Text fw={500} ta="center">
          By using this Website, you acknowledge that you have read, understood, and agree to be
          bound by these Terms of Service.
        </Text>
      </Stack>
    </Container>
  );
}
