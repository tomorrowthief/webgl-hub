export interface WebGLExampleCode {
  javascript: string;
  vertexShader: string;
  fragmentShader: string;
}

export interface WebGLExample {
  id: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  code: WebGLExampleCode;
}
