import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { WEBGL_EXAMPLES } from '../constants';
import CodeEditor from '../components/CodeEditor';
import { WebGLExample } from '../types';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const example: WebGLExample | undefined = WEBGL_EXAMPLES.find((ex) => ex.id === id);

  const [jsCode, setJsCode] = useState('');
  const [vertexCode, setVertexCode] = useState('');
  const [fragmentCode, setFragmentCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const scriptsContainerRef = useRef<HTMLDivElement>(null);

  const handleRunCode = () => {
    setError(null);
    const container = canvasContainerRef.current;
    const scriptsContainer = scriptsContainerRef.current;

    if (!container || !scriptsContainer) return;

    // To prevent WebGL context conflicts, we replace the canvas with a fresh one on every run.
    const oldCanvas = container.querySelector('#gl-canvas');
    if (oldCanvas) {
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'gl-canvas';
        newCanvas.width = 512;
        newCanvas.height = 512;
        newCanvas.className = 'w-full h-full';
        oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
    }

    // Clear previous scripts
    scriptsContainer.innerHTML = '';

    try {
        // Create and append shader scripts to a hidden div for the main script to find
        const vertexScript = document.createElement('script');
        vertexScript.id = 'vertex-shader';
        vertexScript.type = 'x-shader/x-vertex';
        vertexScript.textContent = vertexCode;
        scriptsContainer.appendChild(vertexScript);

        const fragmentScript = document.createElement('script');
        fragmentScript.id = 'fragment-shader';
        fragmentScript.type = 'x-shader/x-fragment';
        fragmentScript.textContent = fragmentCode;
        scriptsContainer.appendChild(fragmentScript);

        // Check if the code is using ES modules ('import' keyword)
        const isModule = /import\s|from\s/.test(jsCode);
        
        if (isModule) {
            // For modules, use a dynamic import.
            // This requires creating a temporary blob URL.
            const blob = new Blob([jsCode], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            import(/* @vite-ignore */ url)
              .catch(e => {
                console.error("Error executing module code:", e);
                setError(`[${e.name}] ${e.message}`);
              })
              .finally(() => {
                URL.revokeObjectURL(url);
              });
        } else {
            // For regular scripts, use the Function constructor in an IIFE.
            const userCode = new Function(`(function() { ${jsCode} })()`);
            userCode();
        }

    } catch (e: any) {
        console.error("Error executing WebGL code:", e);
        setError(`[${e.name}] ${e.message}`);
    }
  };

  useEffect(() => {
    if (example) {
      setJsCode(example.code.javascript.trim());
      setVertexCode(example.code.vertexShader.trim());
      setFragmentCode(example.code.fragmentShader.trim());
      setError(null);
    }
  }, [id, example]);

  useEffect(() => {
      // Run code on initial load or when code is first set
      if(jsCode) {
         const timer = setTimeout(() => handleRunCode(), 100);
         return () => clearTimeout(timer);
      }
  }, [jsCode]);


  if (!example) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-500">Example not found!</h2>
        <Link to="/" className="mt-4 inline-block text-teal-400 hover:text-teal-300">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  const isThreeJs = example.category === 'Introduction to Three.js';

  return (
    <div className="max-w-7xl mx-auto">
      <Link to="/" className="inline-flex items-center mb-6 text-teal-400 hover:text-teal-300 transition-colors">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Examples
      </Link>

      <h1 className="text-4xl font-extrabold text-white mb-8">{example.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left Side: Canvas and Error Display */}
        <div className="flex flex-col space-y-4">
            <div ref={canvasContainerRef} className="relative aspect-square bg-navy-900 rounded-lg shadow-lg overflow-hidden border border-navy-800">
                <canvas id="gl-canvas" width="512" height="512" className="w-full h-full"></canvas>
            </div>
            {error && (
                <div className="p-4 bg-red-900/50 text-red-300 rounded-md font-mono text-sm shadow-inner" role="alert">
                    <p className="font-bold mb-1">Execution Error:</p>
                    <p>{error}</p>
                </div>
            )}
        </div>

        {/* Right Side: Code Editors & Controls */}
        <div className={`flex flex-col space-y-4 ${isThreeJs ? 'lg:aspect-square' : ''}`}>
            <CodeEditor 
                language="JavaScript" 
                value={jsCode} 
                onChange={setJsCode} 
                height={isThreeJs ? 'h-96 lg:h-full' : 'h-64'}
                controls={
                    <button 
                        onClick={handleRunCode}
                        className="flex items-center justify-center px-4 py-1 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-800 focus:ring-teal-400 text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                        Run
                    </button>
                }
            />
            {vertexCode && (
              <CodeEditor language="Vertex Shader (GLSL)" value={vertexCode} onChange={setVertexCode} />
            )}
            {fragmentCode && (
              <CodeEditor language="Fragment Shader (GLSL)" value={fragmentCode} onChange={setFragmentCode} />
            )}
        </div>
      </div>

      {/* Description Below */}
      <div className="bg-navy-900/50 p-6 rounded-lg">
         <h2 className="text-2xl font-bold text-white mb-3">Description</h2>
        <p className="text-lg text-navy-300 leading-relaxed">
            {example.description}
        </p>
      </div>

      <div ref={scriptsContainerRef} style={{ display: 'none' }}></div>
    </div>
  );
};

export default DetailPage;