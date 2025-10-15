import React from 'react';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  height?: string;
  controls?: React.ReactNode;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange, height = 'h-48', controls }) => {
  return (
    <div className={`bg-navy-900 rounded-lg overflow-hidden shadow-lg flex flex-col ${height}`}>
      <div className="flex justify-between items-center px-4 py-2 bg-navy-800">
        <span className="text-xs font-semibold text-navy-300 uppercase">{language}</span>
        {controls && <div>{controls}</div>}
      </div>
      <div className="relative flex-grow">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="w-full h-full p-4 text-sm font-mono bg-transparent text-navy-200 resize-none border-0 focus:ring-0 outline-none absolute inset-0"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
