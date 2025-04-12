import { Box, SegmentedControl } from '@mantine/core';
import { DocumentType, documentTypes } from './translation';

interface Props {
  documentType: string;
  setDocumentType: (type: DocumentType) => void;
}

export const DocumentTypeSelector = ({ documentType, setDocumentType }: Props) => {
  return (
    <Box mb="md">
      <SegmentedControl
        color="blue"
        data={documentTypes}
        value={documentType}
        onChange={setDocumentType}
      />
    </Box>
  );
};
