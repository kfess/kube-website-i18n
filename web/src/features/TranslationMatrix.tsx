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
import { Language, LANGUAGES } from './languages';
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
  } else if (contentType === 'Case Study') {
    const data = await import(`../../../data/output/content_type/case-studies.json`);
    return data.default;
  }else if (contentType === "Partner") {
    const data = await import(`../../../data/output/content_type/partners.json`);
    return data.default;
  } else if (contentType === "Training"){
    const data = await import(`../../../data/output/content_type/training.json`);
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
  const [preferredLanguage, _setPreferredLanguage] = useLocalStorage<Language>({
    key: 'preferred-language',
  });

  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('50');
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const languages = Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>;
  const sortedLanguages = [
    'en' as Language,
    ...(preferredLanguage && preferredLanguage !== 'en' ? [preferredLanguage] : []),
    ...languages.filter((lang) => lang !== preferredLanguage && lang !== 'en'),
  ];

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
              {sortedLanguages.map((lang) => (
                <Table.Th key={lang} style={{ whiteSpace: 'nowrap' }}>
                  <Text size="sm" fw={700}>
                    {LANGUAGES[lang]}
                    {lang === preferredLanguage && (
                      <Text component="span" c="red">
                        {' '}
                        *
                      </Text>
                    )}
                  </Text>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {currentPageData.map(([filePath, fileData]) => (
              <Table.Tr key={filePath}>
                <Table.Td>
                  <Anchor
                    href={`https://github.com/kubernetes/website/blob/main/${filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    c="inherit"
                    underline="hover"
                    // display="inline-flex"
                    // align="center"
                  >
                    <Text size="sm" fw={500} title={filePath}>
                      {filePath}
                    </Text>
                  </Anchor>
                </Table.Td>
                {sortedLanguages.map((lang) => {
                  const exists = fileData.translations[lang]?.exists;

                  const bgColor = exists
                    ? isDark
                      ? 'rgba(34, 139, 34, 0.15)'
                      : '#edf7ed'
                    : isDark
                      ? 'rgba(120, 120, 120, 0.1)'
                      : '#f5f5f5';

                  const textColor = exists
                    ? isDark
                      ? '#4caf50'
                      : '#2e7d32'
                    : isDark
                      ? '#9e9e9e'
                      : '#757575';

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
