
import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-navy-900 rounded-lg overflow-hidden my-4 relative shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-navy-800">
        <span className="text-xs font-semibold text-navy-300 uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-semibold rounded-md hover:bg-teal-500/40 transition-colors"
        >
          {isCopied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
               </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono overflow-x-auto">
        <code className={`language-${language}`}>{code.trim()}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
