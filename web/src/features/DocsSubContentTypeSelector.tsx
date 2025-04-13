import { Group, Radio } from '@mantine/core';
import { DocsSubContentType, docsSubContentTypes } from './translation';

interface Props {
  handleDocsSubTypeChange: (type: DocsSubContentType) => void;
}

export const DocsSubContentTypeSelector = ({ handleDocsSubTypeChange }: Props) => {
  return (
    <Radio.Group name="docs-sub-content-types" my={20} defaultValue={docsSubContentTypes[0]}>
      <Group mt="xs">
        {docsSubContentTypes.map((type) => (
          <Radio
            key={type}
            value={type}
            label={type}
            onChange={(event) => {
              handleDocsSubTypeChange(event.currentTarget.value as DocsSubContentType);
            }}
          />
        ))}
      </Group>
    </Radio.Group>
  );
};
