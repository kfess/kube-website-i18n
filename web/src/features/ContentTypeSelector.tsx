import { Box, SegmentedControl } from '@mantine/core';
import { DocsSubContentTypeSelector } from './DocsSubContentTypeSelector';
import { ContentType, contentTypes, DocsSubContentType } from './translation';

interface Props {
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
  setDocsSubType: (type: DocsSubContentType) => void;
}

export const DocumentTypeSelector = ({ contentType, setContentType, setDocsSubType }: Props) => {
  return (
    <Box mb="md">
      <SegmentedControl
        color="blue"
        data={contentTypes.map((type) => ({
          label: type,
          value: type,
        }))}
        value={contentType}
        onChange={(value) => {
          setContentType(value as ContentType);
        }}
        defaultValue="Docs"
        transitionDuration={200}
      />
      {contentType === 'Docs' && <DocsSubContentTypeSelector setDocsSubType={setDocsSubType} />}
    </Box>
  );
};
