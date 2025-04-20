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
import { TranslationState } from './translation';
import { TranslationFilter, type TranslationStatus } from './TranslationFilter';
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

  // フィルター状態
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>('en');
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus>('all');
  const [filteredTranslations, setFilteredTranslations] =
    useState<TranslationState>(translationData);

  const applyFilter = (
    data: TranslationState,
    filteredLanguage: Language | null,
    filteredStatus: TranslationStatus
  ): TranslationState => {
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
        const hasMatchingStatus =
          filteredStatus === 'untranslated'
            ? !fileData.langs.includes('en') // 未翻訳はen言語がない場合
            : fileData.langs.includes('en'); // 翻訳済みはen言語がある場合

        if (hasMatchingStatus) {
          acc[filePath] = fileData;
        }
        return acc;
      }

      // 指定した言語がlangsに含まれているか確認
      const langExists = fileData.langs.includes(filteredLanguage);

      // ステータスフィルター
      if (
        filteredStatus === 'all' ||
        (filteredStatus === 'untranslated' && !langExists) ||
        (filteredStatus === 'translated' && langExists)
      ) {
        acc[filePath] = fileData;
      }

      return acc;
    }, {} as TranslationState);

    return filteredData;
  };

  // 言語またはステータスが変更されたときにフィルタリングを実行
  useEffect(() => {
    if (Object.keys(translationData).length > 0) {
      const filtered = applyFilter(translationData, selectedLanguage, translationStatus);
      setFilteredTranslations(filtered);

      // フィルター後にページネーションを調整
      const filteredTotalItems = Object.keys(filtered).length;
      const filteredTotalPages = Math.ceil(filteredTotalItems / parseInt(itemsPerPage, 10));
      if (activePage > filteredTotalPages && filteredTotalPages > 0) {
        setActivePage(1);
      }
    }
  }, [selectedLanguage, translationStatus, translationData]);

  const [itemsPerPage, setItemsPerPage] = useState('30');
  const translationEntries = Object.entries(filteredTranslations);
  const totalItems = translationEntries.length;
  const totalPages = Math.ceil(totalItems / parseInt(itemsPerPage, 10));

  const startIndex = (activePage - 1) * parseInt(itemsPerPage, 10);
  const endIndex = Math.min(startIndex + parseInt(itemsPerPage, 10), totalItems);
  const currentPageData = translationEntries.slice(startIndex, endIndex);

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
            data={[
              { value: '30', label: '30' },
              { value: '50', label: '50' },
              { value: '100', label: '100' },
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
                              '/content/en/',
                              `/content/${lang}/`
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
