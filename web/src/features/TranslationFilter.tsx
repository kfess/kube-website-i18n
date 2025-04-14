import { useState } from 'react';
import { IconFilter } from '@tabler/icons-react';
import { Badge, Button, Checkbox, Group, Menu, Select } from '@mantine/core';
import { Language, LANGUAGES } from './languages';

export type TranslationStatus = 'all' | 'untranslated' | 'translated';

interface TranslationFilterProps {
  selectedLanguage: Language | null;
  onLanguageChange: (language: Language | null) => void;
  translationStatus: TranslationStatus;
  onStatusChange: (status: TranslationStatus) => void;
}

export const TranslationFilter = ({
  selectedLanguage,
  onLanguageChange,
  translationStatus,
  onStatusChange,
}: TranslationFilterProps) => {
  const languages = Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>;
  const [opened, setOpened] = useState(false);

  const handleLanguageChange = (value: string | null) => {
    onLanguageChange(value as Language | null);
    if (value === null) {
      setOpened(false);
    }
  };

  const handleStatusChange = (status: TranslationStatus) => {
    onStatusChange(status);
  };

  const handleReset = () => {
    onLanguageChange('en');
    onStatusChange('all');
  };

  const renderFilterBadges = () => {
    const statusLabels = {
      all: 'All',
      untranslated: 'Untranslated',
      translated: 'Translated',
    };

    let badgeText = '';

    if (selectedLanguage) {
      badgeText = `${LANGUAGES[selectedLanguage]}`;
    }

    if (translationStatus !== 'all') {
      badgeText += ` / ${statusLabels[translationStatus]}`;
    } else {
      badgeText += ` / ${statusLabels.all}`;
    }

    if (selectedLanguage === 'en' && translationStatus === 'all') {
      return <></>;
    }

    return [
      <Badge key="filter" color="grape" variant="light" size="lg" style={{ textTransform: 'none' }}>
        {badgeText}
      </Badge>,
    ];
  };

  return (
    <Group>
      <Menu
        opened={opened}
        onChange={setOpened}
        width={300}
        position="bottom-start"
        closeOnItemClick={false}
      >
        <Menu.Target>
          <Button variant="default" leftSection={<IconFilter size={16} />}>
            Filter
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>言語</Menu.Label>
          <Menu.Item closeMenuOnClick={false}>
            <Select
              placeholder="Select language for filter"
              data={languages.map((lang) => ({ value: lang, label: LANGUAGES[lang] }))}
              value={selectedLanguage}
              onChange={handleLanguageChange}
              clearable
              searchable
              onClick={(e) => e.stopPropagation()}
            />
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>ステータス</Menu.Label>
          <Menu.Item closeMenuOnClick={false}>
            <Checkbox
              label="All"
              checked={translationStatus === 'all'}
              onChange={() => handleStatusChange('all')}
              style={{ marginBottom: 5 }}
            />
          </Menu.Item>
          <Menu.Item closeMenuOnClick={false}>
            <Checkbox
              label="Untranslated"
              checked={translationStatus === 'untranslated'}
              onChange={() => handleStatusChange('untranslated')}
              style={{ marginBottom: 5 }}
            />
          </Menu.Item>
          <Menu.Item closeMenuOnClick={false}>
            <Checkbox
              label="Translated"
              checked={translationStatus === 'translated'}
              onChange={() => handleStatusChange('translated')}
            />
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item color="red" onClick={handleReset}>
            Reset
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Group gap="xs">{renderFilterBadges()}</Group>
    </Group>
  );
};
