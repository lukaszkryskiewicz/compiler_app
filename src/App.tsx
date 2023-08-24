import React, { useEffect, useRef, useState } from 'react';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
  const [input, setInput] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const ref = useRef<any>();

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ref.current) return;

    /*    const result = await ref.current.transform(input, {
      loader: 'jsx',
      target: 'es2015',
    }); */

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });
    console.log(result);
    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={10}
          cols={100}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      <pre>{code}</pre>
    </div>
  );
};

export default App;
