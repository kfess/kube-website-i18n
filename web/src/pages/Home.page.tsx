import { useState } from 'react';
import { Container } from '@mantine/core';
import { Welcome } from '@/components/Welcome/Welcome';
import { DocumentTypeSelector } from '@/features/ContentTypeSelector';
import { ContentType, DocsSubContentType } from '@/features/translation';
import { TranslationMatrix } from '@/features/TranslationMatrix';

export function HomePage() {
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('Blog');
  const [selectedDocsSubType, setSelectedDocsSubType] = useState<DocsSubContentType>('Concepts');

  return (
    <>
      <Welcome />
      <Container size="xl" py="xl">
        <DocumentTypeSelector
          contentType={selectedContentType}
          setContentType={setSelectedContentType}
          setDocsSubType={setSelectedDocsSubType}
        />
        <TranslationMatrix
          contentType={selectedContentType}
          docsSubContentType={selectedDocsSubType}
        />
      </Container>
    </>
  );
}
