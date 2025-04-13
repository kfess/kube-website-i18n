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
import { TranslationFilter, type TranslationStatus } from './TranslationFilter';

const getTranslationData = async (
  contentType: ContentType,
  docsSubContentType?: DocsSubContentType
): Promise<TranslationState> => {
  if (contentType === 'Docs') {
    if (docsSubContentType === 'Concepts') {
      const data = await import(`../../../data/output/content_type/docs/concepts.json`);
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
  } else if (contentType === 'Partner') {
    const data = await import(`../../../data/output/content_type/partners.json`);
    return data.default;
  } else if (contentType === 'Training') {
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

type Props = (BaseProps | DocsProps) & {
  activePage: number;
  setActivePage: (page: number) => void;
};

export const TranslationMatrix = (props: Props) => {
  const [translations, setTranslations] = useState<TranslationState>({});
  const [preferredLanguage, _setPreferredLanguage] = useLocalStorage<Language>({
    key: 'preferred-language',
  });

  // フィルター状態
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>('en');
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus>('all');
  const [filteredTranslations, setFilteredTranslations] = useState<TranslationState>({});

  const applyFilter = (
    data: TranslationState,
    filteredLanguage: Language | null,
    filteredStatus: TranslationStatus
  ): TranslationState => {
    // フィルター条件がなければ元のデータをそのまま返す
    if (!filteredLanguage && filteredStatus === 'all') {
      return data;
    }

    // フィルター処理
    const filteredData = Object.entries(data).reduce((acc, [filePath, fileData]) => {
      // 言語フィルターが指定されていない場合は、ファイルをそのまま追加（ステータスフィルターは後で処理）
      if (!filteredLanguage) {
        if (filteredStatus === 'all') {
          acc[filePath] = fileData;
          return acc;
        }

        // ステータスによるフィルタリング（全言語対象）
        const hasMatchingStatus = Object.values(fileData.translations).some(
          (langData) =>
            (filteredStatus === 'untranslated' && !langData.exists) ||
            (filteredStatus === 'translated' && langData.exists)
        );

        if (hasMatchingStatus) {
          acc[filePath] = fileData;
        }
        return acc;
      }

      // 指定した言語が存在するか確認
      const langData = fileData.translations[filteredLanguage];
      if (!langData) {
        return acc;
      }

      // ステータスフィルター
      if (
        filteredStatus === 'all' ||
        (filteredStatus === 'untranslated' && !langData.exists) ||
        (filteredStatus === 'translated' && langData.exists)
      ) {
        acc[filePath] = fileData;
      }

      return acc;
    }, {} as TranslationState);

    return filteredData;
  };

  // 言語またはステータスが変更されたときにフィルタリングを実行
  useEffect(() => {
    if (Object.keys(translations).length > 0) {
      const filtered = applyFilter(translations, selectedLanguage, translationStatus);
      setFilteredTranslations(filtered);

      // フィルター後にページネーションを調整
      const filteredTotalItems = Object.keys(filtered).length;
      const filteredTotalPages = Math.ceil(filteredTotalItems / parseInt(itemsPerPage, 10));
      if (props.activePage > filteredTotalPages && filteredTotalPages > 0) {
        props.setActivePage(1);
      }
    }
  }, [selectedLanguage, translationStatus]);

  const [itemsPerPage, setItemsPerPage] = useState('50');
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const languages = Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>;
  const sortedLanguages = [
    'en' as Language,
    ...(preferredLanguage && preferredLanguage !== 'en' ? [preferredLanguage] : []),
    ...languages.filter((lang) => lang !== preferredLanguage && lang !== 'en'),
  ];

  const translationEntries = Object.entries(filteredTranslations);
  const totalItems = translationEntries.length;
  const totalPages = Math.ceil(totalItems / parseInt(itemsPerPage, 10));

  const startIndex = (props.activePage - 1) * parseInt(itemsPerPage, 10);
  const endIndex = Math.min(startIndex + parseInt(itemsPerPage, 10), totalItems);
  const currentPageData = translationEntries.slice(startIndex, endIndex);

  // データ取得時の処理
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data: TranslationState;
        if (props.contentType === 'Docs') {
          data = await getTranslationData(props.contentType, props.docsSubContentType);
        } else {
          data = await getTranslationData(props.contentType);
        }

        setTranslations(data);
        // 初期表示時も現在のフィルターを適用
        setFilteredTranslations(applyFilter(data, selectedLanguage, translationStatus));
      } catch (error) {
        console.error('Error fetching translation data:', error);
      }
    };

    fetchData();
  }, [props.contentType, props.contentType === 'Docs' ? props.docsSubContentType : undefined]);

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
              setItemsPerPage(value || '50');
              props.setActivePage(1);
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
            value={props.activePage}
            onChange={props.setActivePage}
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
          {translationEntries.length > 0 ? (
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
                          {exists ? (
                            <Anchor
                              href={`https://github.com/kubernetes/website/blob/main/${fileData.translations[lang].path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              c="inherit"
                              underline="never"
                            >
                              ✅
                            </Anchor>
                          ) : (
                            '-'
                          )}
                        </Text>
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              ))}
            </Table.Tbody>
          ) : (
            <Table.Tbody>
              <Table.Tr>
                <Table.Td
                  colSpan={sortedLanguages.length + 1}
                  style={{ textAlign: 'center' }}
                  py="xl"
                >
                  <Text size="md" c="dimmed">
                    No data available
                  </Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          )}
        </Table>
      </Box>
      <Group justify="right" mt="md">
        <Text size="sm">
          Showing {startIndex + 1} - {endIndex} of {totalItems} items
        </Text>
      </Group>
    </Stack>
  );
};
