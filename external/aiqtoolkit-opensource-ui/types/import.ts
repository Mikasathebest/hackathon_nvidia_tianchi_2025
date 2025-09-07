import { SupportedExportFormats } from './export';

export interface ImportedFile {
  type: 'json' | 'pdf' | 'image';
  data: SupportedExportFormats | File;
  fileName: string;
}
