import { Group, Radio } from '@mantine/core';
import { DocsSubContentType, docsSubContentTypes } from './translation';

const formatDocsSubContentTypeLabel = (t: DocsSubContentType) => {
  switch (t) {
    case 'concept':
      return 'Concept';
    case 'task':
      return 'Task';
    case 'reference':
      return 'Reference';
    case 'tutorial':
      return 'Tutorial';
    case 'contribute':
      return 'Contribute';
  }
};

interface Props {
  handleDocsSubTypeChange: (type: DocsSubContentType) => void;
}

export const DocsSubContentTypeSelector = ({ handleDocsSubTypeChange }: Props) => {
  return (
    <Radio.Group name="docs-sub-content-types" my={20} defaultValue={docsSubContentTypes[0]}>
      <Group mt="xs">
        {docsSubContentTypes.map((t) => (
          <Radio
            key={t}
            value={t}
            label={formatDocsSubContentTypeLabel(t)}
            onChange={(event) => {
              handleDocsSubTypeChange(event.currentTarget.value as DocsSubContentType);
            }}
          />
        ))}
      </Group>
    </Radio.Group>
  );
};
