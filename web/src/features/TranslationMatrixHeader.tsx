import { Table, Text } from '@mantine/core';
import { LANGUAGES, type Language } from './languages';

interface Props {
  preferredLanguage: Language;
  languages: Language[];
}

export const TranslationMatrixHeader = ({ preferredLanguage, languages }: Props) => {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>File Path</Table.Th>
        {languages.map((lang) => (
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
  );
};
