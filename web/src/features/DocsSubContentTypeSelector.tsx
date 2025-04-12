import { Group, Radio } from '@mantine/core';
import { DocsSubContentType, docsSubContentTypes } from './translation';

interface Props {
  setDocsSubType: (type: DocsSubContentType) => void;
}

export const DocsSubContentTypeSelector = ({ setDocsSubType }: Props) => {
  return (
    <Radio.Group name="docs-sub-content-types" my={20} defaultValue={docsSubContentTypes[0]}>
      <Group mt="xs">
        {docsSubContentTypes.map((type) => (
          <Radio
            key={type}
            value={type}
            label={type}
            onChange={(event) => {
              setDocsSubType(event.currentTarget.value as DocsSubContentType);
            }}
          />
        ))}
      </Group>
    </Radio.Group>
  );
};
