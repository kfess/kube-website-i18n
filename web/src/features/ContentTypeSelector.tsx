import { Box, SegmentedControl } from '@mantine/core';
import { DocsSubContentTypeSelector } from './DocsSubContentTypeSelector';
import { ContentType, contentTypes, DocsSubContentType } from './translation';

interface Props {
  contentType: ContentType;
  handleContentTypeChange: (type: ContentType) => void;
  handleDocsSubTypeChange: (type: DocsSubContentType) => void;
}

export const ContentTypeSelector = ({
  contentType,
  handleContentTypeChange,
  handleDocsSubTypeChange,
}: Props) => {
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
          handleContentTypeChange(value as ContentType);
        }}
        defaultValue="Docs"
        transitionDuration={200}
      />
      {contentType === 'docs' && (
        <DocsSubContentTypeSelector handleDocsSubTypeChange={handleDocsSubTypeChange} />
      )}
    </Box>
  );
};
