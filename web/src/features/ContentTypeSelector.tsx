import { Box, SegmentedControl } from '@mantine/core';
import { DocsSubContentTypeSelector } from './DocsSubContentTypeSelector';
import { ContentType, contentTypes, DocsSubContentType } from './translation';

const formatContentTypeLabel = (t: ContentType) => {
  switch (t) {
    case 'docs':
      return 'Docs';
    case 'blog':
      return 'Blog';
    case 'case_study':
      return 'Case-Study';
    case 'community':
      return 'Community';
    case 'example':
      return 'Example';
    case 'include':
      return 'Include';
    case 'partner':
      return 'Partner';
    case 'release':
      return 'Release';
    case 'training':
      return 'Training';
  }
};

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
        data={contentTypes.map((t) => ({
          label: formatContentTypeLabel(t),
          value: t,
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
