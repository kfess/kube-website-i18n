import { IconBrandGithubFilled, IconMoon, IconSun } from '@tabler/icons-react';
import {
  ActionIcon,
  AppShell,
  Group,
  Image,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import kubernetesLogo from '../assets/kubernetes.svg';
import { Footer } from './Footer';
import { LanguageSelector } from './LanguageSelector';

export const NavigationBar = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <>
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Group>
                <Image src={kubernetesLogo} h={30} w="auto" alt="Kubernetes logo" />
                <Text fw={700} size="lg">
                  Kubernetes Website Translation
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
                <Tooltip label="Source Code" position="bottom" withArrow offset={10}>
                  <IconBrandGithubFilled size={20} />
                </Tooltip>
              </ActionIcon>
              <ActionIcon
                variant="default"
                radius="md"
                size="lg"
                onClick={() => toggleColorScheme()}
                aria-label="Toggle color scheme"
              >
                <Tooltip
                  label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}
                  position="bottom"
                  withArrow
                  offset={10}
                >
                  {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
                </Tooltip>
              </ActionIcon>
              <LanguageSelector />
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
      <Footer />
    </>
  );
};
