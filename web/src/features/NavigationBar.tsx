import {
  IconBook,
  IconBrandGithubFilled,
  IconGitBranch,
  IconLanguage,
  IconMoon,
  IconSun,
} from '@tabler/icons-react';
import {
  ActionIcon,
  AppShell,
  Burger,
  Divider,
  Group,
  Image,
  NavLink,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import kubernetesLogo from '../assets/kubernetes.svg';

interface NavbarLink {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
}

export const NavigationBar = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const mainLinks: NavbarLink[] = [
    {
      icon: <IconBook size={20} />,
      label: 'Translation',
      description: 'Documentation translation status',
    },
    {
      icon: <IconLanguage size={20} />,
      label: 'Languages statistics',
      description: 'Statistics for each language',
    },
    {
      icon: <IconGitBranch size={20} />,
      label: 'Contributors',
      description: 'Contributors to the translation',
    },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group>
              <Image src={kubernetesLogo} h={30} w="auto" alt="Kubernetes logo" />
              <Text fw={700} size="lg">
                Kubernetes Translation Dashboard
              </Text>
            </Group>
          </Group>
          <Group gap={8}>
            <ActionIcon
              component="a"
              href="https://github.com/kfess/kube-website-i18n"
              target="_blank"
              variant="default"
              radius="md"
              size="lg"
              aria-label="GitHub"
            >
              <IconBrandGithubFilled size={20} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              radius="md"
              size="lg"
              onClick={() => toggleColorScheme()}
              aria-label="Toggle color scheme"
            >
              {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          {mainLinks.map((link) => (
            <NavbarLink key={link.label} {...link} />
          ))}
        </AppShell.Section>
        <AppShell.Section>
          <Divider my="sm" />
          <Group justify="space-between" px="md" py="sm">
            <Text size="xs" c="dimmed">
              Last updated: 2025-04-12
            </Text>
            <Group gap={5}>
              <ActionIcon
                component="a"
                href="https://github.com/kubernetes/website"
                target="_blank"
                size="lg"
                variant="subtle"
                color="gray"
              >
                <IconGitBranch stroke={1.5} size={20} />
              </ActionIcon>
            </Group>
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

function NavbarLink({ icon, label, description, onClick }: NavbarLink) {
  return (
    <NavLink
      label={
        <Text size="sm" fw={500}>
          {label}
        </Text>
      }
      description={description && <Text size="xs">{description}</Text>}
      leftSection={icon}
      onClick={onClick}
      color="blue"
      py="xs"
    />
  );
}
