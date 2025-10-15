
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { WEBGL_EXAMPLES } from '../../constants';
import CodeEditor from '../../components/CodeEditor';
import { WebGLExample } from '../../types';

interface DetailPageProps {
  example: WebGLExample;
}

const DetailPage: NextPage<DetailPageProps> = ({ example }) => {
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

    const oldCanvas = container.querySelector('#gl-canvas');
    if (oldCanvas) {
      if ((oldCanvas as any).animationFrameId) {
        cancelAnimationFrame((oldCanvas as any).animationFrameId);
      }
      const newCanvas = document.createElement('canvas');
      newCanvas.id = 'gl-canvas';
      newCanvas.width = 512;
      newCanvas.height = 512;
      newCanvas.className = 'w-full h-full';
      oldCanvas.parentNode!.replaceChild(newCanvas, oldCanvas);
    }

    scriptsContainer.innerHTML = '';

    try {
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

      const isModule = /import\s|from\s/.test(jsCode);
      
      if (isModule) {
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
  }, [example]);

  useEffect(() => {
    if(jsCode) {
       const timer = setTimeout(() => handleRunCode(), 100);
       return () => clearTimeout(timer);
    }
  }, [jsCode, vertexCode, fragmentCode]);

  if (!example) {
    return (
      <div className="text-center">
        <Head>
            <title>Example Not Found - WebGL Hub</title>
        </Head>
        <h2 className="text-2xl font-bold text-red-500">Example not found!</h2>
        <Link href="/" className="mt-4 inline-block text-teal-400 hover:text-teal-300">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  const isThreeJs = example.category.includes('Three.js');

  return (
    <div className="max-w-7xl mx-auto">
       <Head>
        <title>{example.title} - WebGL Hub</title>
        <meta name="description" content={example.summary} />
      </Head>

      <Link href="/" className="inline-flex items-center mb-6 text-teal-400 hover:text-teal-300 transition-colors">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Examples
      </Link>

      <h1 className="text-4xl font-extrabold text-white mb-8">{example.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
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

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = WEBGL_EXAMPLES.map(example => ({
    params: { id: example.id },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params!;
  const example = WEBGL_EXAMPLES.find(ex => ex.id === id as string);
  return { props: { example: example || null } };
};

export default DetailPage;
