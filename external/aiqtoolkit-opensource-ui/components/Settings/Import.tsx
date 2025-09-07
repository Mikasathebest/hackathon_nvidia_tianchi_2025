import { IconFileImport, IconLoader2 } from '@tabler/icons-react';
import { FC, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { ImportedFile } from '@/types/import';

import { SidebarButton } from '../Sidebar/SidebarButton';

interface Props {
  onImport: (data: ImportedFile) => Promise<void>;
}

export const Import: FC<Props> = ({ onImport }) => {
  const { t } = useTranslation('sidebar');
  const [isProcessing, setIsProcessing] = useState(false);
  return (
    <>
      <input
        id="import-file"
        className="sr-only"
        tabIndex={-1}
        type="file"
        accept=".json,.pdf,.jpg,.jpeg,.png"
        onChange={async (e) => {
          if (!e.target.files?.length) return;

          const file = e.target.files[0];
          const fileName = file.name;
          const fileExtension = fileName.split('.').pop()?.toLowerCase();

          if (fileExtension === 'json') {
            const reader = new FileReader();
            reader.onload = async (e) => {
              try {
                let json = JSON.parse(e.target?.result as string);
                await onImport({
                  type: 'json',
                  data: json,
                  fileName
                });
              } catch (error) {
                console.error('Error parsing JSON file:', error);
                alert('Error: Invalid JSON file format');
              }
            };
            reader.readAsText(file);
          } else if (fileExtension === 'pdf') {
            setIsProcessing(true);
            try {
              await onImport({
                type: 'pdf',
                data: file,
                fileName
              });
            } catch (error) {
              console.error('PDF processing error:', error);
            } finally {
              setIsProcessing(false);
            }
          } else if (['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
            setIsProcessing(true);
            try {
              await onImport({
                type: 'image',
                data: file,
                fileName
              });
            } catch (error) {
              console.error('Image processing error:', error);
            } finally {
              setIsProcessing(false);
            }
          } else {
            alert('Unsupported file format. Please select a JSON, PDF, JPG, or PNG file.');
          }
          
          // Reset the input value so the same file can be selected again
          e.target.value = '';
        }}
      />

      <SidebarButton
        text={isProcessing ? 'Processing...' : t('Import data')}
        icon={isProcessing ? <IconLoader2 size={18} className="animate-spin" /> : <IconFileImport size={18} />}
        onClick={() => {
          if (isProcessing) return;
          const importFile = document.querySelector(
            '#import-file',
          ) as HTMLInputElement;
          if (importFile) {
            importFile.click();
          }
        }}
      />
    </>
  );
};
