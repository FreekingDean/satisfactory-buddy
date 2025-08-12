import React, { useCallback } from 'react';

interface SaveFileUploaderProps {
  onSaveFileParsed: (saveData: any) => void;
  onError: (error: string) => void;
}

const SaveFileUploader: React.FC<SaveFileUploaderProps> = ({ onSaveFileParsed, onError }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, 'Size:', file.size);

    if (!file.name.endsWith('.sav')) {
      onError('Please select a .sav file');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Reading file buffer...');
      const arrayBuffer = await file.arrayBuffer();
      const fileName = file.name.replace('.sav', '');
      
      console.log('Loading parser...');
      const { Parser } = await import('@etothepii/satisfactory-file-parser');
      
      console.log('Parsing save file...');
      const saveData = Parser.ParseSave(fileName, arrayBuffer);
      
      console.log('Save data parsed:', saveData);
      onSaveFileParsed(saveData);
    } catch (error) {
      console.error('Error parsing save file:', error);
      onError(`Failed to parse save file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [onSaveFileParsed, onError]);

  return (
    <div style={{ 
      padding: '16px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      borderRadius: '8px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      minWidth: '280px'
    }}>
      <label htmlFor="save-file-input" style={{ 
        display: 'block', 
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: isLoading ? '#888' : '#fff'
      }}>
        📁 Load Satisfactory Save File {isLoading && '⏳'}
      </label>
      <input
        id="save-file-input"
        type="file"
        accept=".sav"
        onChange={handleFileChange}
        disabled={isLoading}
        style={{ 
          width: '100%',
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '6px',
          color: 'white',
          fontSize: '14px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1,
          transition: 'all 0.2s ease'
        }}
      />
    </div>
  );
};

export default SaveFileUploader;