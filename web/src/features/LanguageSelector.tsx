import { IconCheck, IconWorld } from '@tabler/icons-react';
import { ActionIcon, Group, Menu, Text, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Language, LANGUAGES } from './languages';

export function LanguageSelector() {
  const [preferredLanguage, setPreferredLanguage] = useLocalStorage<Language | null>({
    key: 'preferred-language',
    defaultValue: 'en',
  });

  const handleLanguageSelect = (lang: Language) => {
    setPreferredLanguage(lang === preferredLanguage ? 'en' : lang);
  };

  return (
    <Menu position="bottom-end" withinPortal>
      <Menu.Target>
        <Tooltip label="Preferred Language" position="bottom" withArrow offset={10}>
          <ActionIcon variant="default" radius="md" size="lg">
            <IconWorld size={20} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Select Preferred Language</Menu.Label>
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <Menu.Item
            key={code}
            onClick={() => handleLanguageSelect(code as Language)}
            rightSection={preferredLanguage === code ? <IconCheck size={16} /> : null}
          >
            <Group>
              <Text size="sm">{name}</Text>
              {code === 'en' && (
                <Text size="xs" c="dimmed">
                  (Default)
                </Text>
              )}
            </Group>
          </Menu.Item>
        ))}
        {preferredLanguage && (
          <Menu.Item color="red" onClick={() => setPreferredLanguage(null)}>
            Clear Preferred Language
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
