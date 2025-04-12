import { useEffect, useState } from 'react';
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
import { LANGUAGES } from './languages';
import { ContentType, DocsSubContentType, TranslationState } from './translation';

const getTranslationData = async (
  contentType: ContentType,
  docsSubContentType?: DocsSubContentType
): Promise<TranslationState> => {
  if (contentType === 'Docs') {
    if (docsSubContentType === 'Concepts') {
      const data = await import(`../../../data/output/content_type/docs/concepts.json`);
      return data.default;
    } else if (docsSubContentType === 'Getting Started') {
      const data = await import(
        `../../../data/output/content_type/docs/getting-started-guides.json`
      );
      return data.default;
    } else if (docsSubContentType === 'Reference') {
      const data = await import(`../../../data/output/content_type/docs/reference.json`);
      return data.default;
    } else if (docsSubContentType === 'Tutorials') {
      const data = await import(`../../../data/output/content_type/docs/tutorials.json`);
      return data.default;
    } else if (docsSubContentType === 'Tasks') {
      const data = await import(`../../../data/output/content_type/docs/tasks.json`);
      return data.default;
    } else if (docsSubContentType === 'Contribute') {
      const data = await import(`../../../data/output/content_type/docs/contribute.json`);
      return data.default;
    }
  } else if (contentType === 'Blog') {
    const data = await import(`../../../data/output/content_type/blog.json`);
    return data.default;
  } else if (contentType === 'Release') {
    const data = await import(`../../../data/output/content_type/releases.json`);
    return data.default;
  } else if (contentType === 'Community') {
    const data = await import(`../../../data/output/content_type/community.json`);
    return data.default;
  } else if (contentType === 'Example') {
    const data = await import(`../../../data/output/content_type/examples.json`);
    return data.default;
  } else if (contentType === 'Include') {
    const data = await import(`../../../data/output/content_type/includes.json`);
    return data.default;
  } else if (contentType === 'Case-study') {
    const data = await import(`../../../data/output/content_type/case-studies.json`);
    return data.default;
  }

  throw new Error(`Unknown content type: ${contentType}`);
};

// Other types
type BaseProps = {
  contentType: Exclude<ContentType, 'Docs'>;
};

// Docs-specific props
type DocsProps = {
  contentType: 'Docs';
  docsSubContentType: DocsSubContentType;
};

type Props = BaseProps | DocsProps;

export const TranslationMatrix = (props: Props) => {
  const [translations, setTranslations] = useState<TranslationState>({});

  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('50');
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const languages = Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>;

  const translationEntries = Object.entries(translations);
  const totalItems = translationEntries.length;
  const totalPages = Math.ceil(totalItems / parseInt(itemsPerPage, 10));

  const startIndex = (activePage - 1) * parseInt(itemsPerPage, 10);
  const endIndex = Math.min(startIndex + parseInt(itemsPerPage, 10), totalItems);
  const currentPageData = translationEntries.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (props.contentType === 'Docs') {
          const data = await getTranslationData(props.contentType, props.docsSubContentType);
          setTranslations(data);
        } else {
          const data = await getTranslationData(props.contentType);
          setTranslations(data);
        }
      } catch (error) {
        console.error('Error fetching translation data:', error);
      }
    };

    fetchData();
  }, [props.contentType, props.contentType === 'Docs' ? props.docsSubContentType : undefined]);

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
              setItemsPerPage(value || '50');
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
            siblings={1}
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
                      ? 'rgba(120, 120, 120, 0.1)' // 暗いモードでの灰色背景
                      : '#f5f5f5'; // 明るいモードでの灰色背景

                  const textColor = exists
                    ? isDark
                      ? '#4caf50'
                      : '#2e7d32'
                    : isDark
                      ? '#9e9e9e' // 暗いモードでの灰色テキスト
                      : '#757575'; // 明るいモードでの灰色テキスト

                  return (
                    <Table.Td
                      key={lang}
                      style={{
                        backgroundColor: bgColor,
                        textAlign: 'center',
                      }}
                    >
                      <Text c={textColor} fw={600}>
                        {exists ? '✅' : '–'}
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
