import { useEffect, useState } from 'react';
import {
  Anchor,
  Box,
  Group,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useTranslationFilter } from './hooks/useTranslationFilter';
import { Language, LANGUAGES } from './languages';
import { TranslationState } from './translation';
import { TranslationFilter } from './TranslationFilter';
import { TranslationMatrixHeader } from './TranslationMatrixHeader';

const getSortedLanguages = (preferred?: Language): Language[] => {
  const langs = Object.keys(LANGUAGES) as Language[];
  const rest = langs.filter((l) => l !== 'en' && l !== preferred);
  return ['en', ...(preferred && preferred !== 'en' ? [preferred] : []), ...rest];
};

type Props = {
  translationData: TranslationState;
  activePage: number;
  setActivePage: (page: number) => void;
};

export const TranslationMatrix = ({ translationData, activePage, setActivePage }: Props) => {
  // 言語設定
  const [preferredLanguage, _] = useLocalStorage<Language>({
    key: 'preferred-language',
  });
  const sortedLanguages = getSortedLanguages(preferredLanguage);

  // Color scheme
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Filter
  const {
    selectedLanguage,
    setSelectedLanguage,
    translationStatus,
    setTranslationStatus,
    filteredTranslations,
  } = useTranslationFilter(translationData);

  // Pagination
  const [itemsPerPage, setItemsPerPage] = useState('30');
  const translationEntries = Object.entries(filteredTranslations);
  const totalItems = translationEntries.length;
  const totalPages = Math.ceil(totalItems / parseInt(itemsPerPage, 10));
  const [startIndex, endIndex] = [
    (activePage - 1) * parseInt(itemsPerPage, 10),
    Math.min(
      (activePage - 1) * parseInt(itemsPerPage, 10) + parseInt(itemsPerPage, 10),
      totalItems
    ),
  ];
  const currentPageData = translationEntries.slice(startIndex, endIndex);

  useEffect(() => {
    setActivePage(1);
  }, [translationData, selectedLanguage, translationStatus]);

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <TranslationFilter
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          translationStatus={translationStatus}
          onStatusChange={setTranslationStatus}
        />
        <Group>
          <Select
            size="xs"
            value={itemsPerPage}
            onChange={(value) => {
              setItemsPerPage(value || '30');
              setActivePage(1);
            }}
            data={['30', '50', '100'].map((value) => ({ value, label: value }))}
            style={{ width: 80 }}
          />
          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={totalPages}
            size="sm"
            withEdges
          />
        </Group>
      </Group>
      <Box style={{ overflowX: 'auto' }}>
        <Table stickyHeader withTableBorder withColumnBorders verticalSpacing={5}>
          <TranslationMatrixHeader
            preferredLanguage={preferredLanguage}
            languages={sortedLanguages}
          />
          <Table.Tbody>
            {translationEntries.length > 0 ? (
              currentPageData.map(([filePath, fileData]) => (
                <Table.Tr key={filePath}>
                  <Table.Td>
                    <Anchor
                      href={`https://github.com/kubernetes/website/blob/main/${filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      c="inherit"
                    >
                      <Text size="sm" fw={500} title={filePath}>
                        {filePath}
                      </Text>
                    </Anchor>
                  </Table.Td>
                  {sortedLanguages.map((lang) => {
                    const exists = fileData.langs.includes(lang);
                    const bgColor = exists ? (isDark ? 'rgba(34, 139, 34, 0.15)' : '#edf7ed') : '';

                    return (
                      <Table.Td
                        key={lang}
                        style={{ backgroundColor: bgColor, textAlign: 'center' }}
                      >
                        {exists ? (
                          <Anchor
                            href={`https://github.com/kubernetes/website/blob/main/${filePath.replace(
                              'content/en/',
                              `content/${lang}/`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="never"
                          >
                            ✅
                          </Anchor>
                        ) : (
                          <>-</>
                        )}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td
                  colSpan={sortedLanguages.length + 1}
                  style={{ textAlign: 'center' }}
                  py="xl"
                  c="dimmed"
                >
                  No data available
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>
      <Group justify="right">
        <Text size="sm">
          Showing {startIndex + 1} - {endIndex} of {totalItems} items
        </Text>
      </Group>
    </Stack>
  );
};
