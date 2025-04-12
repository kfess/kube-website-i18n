import { useState } from 'react';
import { Container } from '@mantine/core';
import { Welcome } from '@/components/Welcome/Welcome';
import { DocumentTypeSelector } from '@/features/ClassificationSelector';
import { NavigationBar } from '@/features/NavigationBar';
import { DocumentType } from '@/features/translation';
import { TranslationMatrix } from '@/features/TranslationMatrix';

export function HomePage() {
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>('blog');

  return (
    <>
      <NavigationBar>
        <Welcome />
        <Container size="xl" py="xl">
          <DocumentTypeSelector
            documentType={selectedDocumentType}
            setDocumentType={setSelectedDocumentType}
          />
          <TranslationMatrix documentType="blog" />
        </Container>
      </NavigationBar>
    </>
  );
}
