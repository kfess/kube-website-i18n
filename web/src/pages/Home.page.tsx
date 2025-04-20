import { useState } from 'react';
import { Container, Divider } from '@mantine/core';
import { Welcome } from '@/components/Welcome/Welcome';
import { ContentTypeSelector } from '@/features/ContentTypeSelector';
import { useFetchTranslationData } from '@/features/hooks/useFetchTranslationData';
import { ContentType, DocsSubContentType } from '@/features/translation';
import { TranslationMatrix } from '@/features/TranslationMatrix';

export function HomePage() {
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('docs');
  const [selectedDocsSubType, setSelectedDocsSubType] = useState<DocsSubContentType>('concept');

  const translationData = useFetchTranslationData(
    selectedContentType,
    selectedContentType === 'docs' ? selectedDocsSubType : undefined
  );

  const [activePage, setActivePage] = useState(1);

  const handleContentTypeChange = (newType: ContentType) => {
    setSelectedContentType(newType);
    setActivePage(1);
  };

  const handleDocsSubTypeChange = (newSubType: DocsSubContentType) => {
    setSelectedDocsSubType(newSubType);
    setActivePage(1);
  };

  return (
    <>
      <Welcome />
      <Container size="xl" py="xl">
        <ContentTypeSelector
          contentType={selectedContentType}
          handleContentTypeChange={handleContentTypeChange}
          handleDocsSubTypeChange={handleDocsSubTypeChange}
        />
        <Divider my="lg" />
        <TranslationMatrix
          translationData={translationData}
          activePage={activePage}
          setActivePage={setActivePage}
        />
      </Container>
    </>
  );
}
