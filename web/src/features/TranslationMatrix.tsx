import { useState } from 'react';
import {
  Box,
  Group,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import translationsData from '../../../data/output/content_type/blog.json';
import { LANGUAGES } from './languages';
import { DocumentType, TranslationState } from './translation';

interface Props {
  documentType: DocumentType;
}

export const TranslationMatrix = ({ documentType }: Props) => {
  const [translations, _setTranslations] = useState<TranslationState>(translationsData);
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('20');
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const languages = Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>;

  const translationEntries = Object.entries(translations);
  const totalItems = translationEntries.length;
  const totalPages = Math.ceil(totalItems / parseInt(itemsPerPage, 10));

  const startIndex = (activePage - 1) * parseInt(itemsPerPage, 10);
  const endIndex = Math.min(startIndex + parseInt(itemsPerPage, 10), totalItems);
  const currentPageData = translationEntries.slice(startIndex, endIndex);

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Text size="sm">
          Showing {startIndex + 1} - {endIndex} of {totalItems} items
        </Text>
        <Group>
          <Select
            size="xs"
            value={itemsPerPage}
            onChange={(value) => {
              setItemsPerPage(value || '20');
              setActivePage(1);
            }}
            data={[
              { value: '20', label: '20' },
              { value: '50', label: '50' },
              { value: '100', label: '100' },
              { value: '200', label: '200' },
            ]}
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
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>File Path</Table.Th>
              {languages.map((lang) => (
                <Table.Th key={lang} style={{ whiteSpace: 'nowrap' }}>
                  <Text size="sm" fw={500}>
                    {LANGUAGES[lang]}
                  </Text>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {currentPageData.map(([filePath, fileData]) => (
              <Table.Tr key={filePath}>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {filePath}
                  </Text>
                </Table.Td>
                {languages.map((lang) => {
                  const exists = fileData.translations[lang]?.exists;

                  const bgColor = exists
                    ? isDark
                      ? 'rgba(34, 139, 34, 0.15)'
                      : '#edf7ed'
                    : isDark
                      ? 'rgba(220, 20, 60, 0.1)'
                      : '#ffebee';

                  const textColor = exists
                    ? isDark
                      ? '#4caf50'
                      : '#2e7d32'
                    : isDark
                      ? '#f44336'
                      : '#c62828';

                  return (
                    <Table.Td
                      key={lang}
                      style={{
                        backgroundColor: bgColor,
                        textAlign: 'center',
                      }}
                    >
                      <Text c={textColor} fw={600}>
                        {exists ? '✓' : '-'}
                      </Text>
                    </Table.Td>
                  );
                })}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Stack>
  );
};
