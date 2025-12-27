'use client';

import { useEffect, useState } from 'react';
import { $typst } from '@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs';

// Configure the global instance
// We try to set options. If it throws because it's already set, we ignore.
try {
  $typst.setCompilerInitOptions({
    getModule: () => '/wasm/typst_ts_web_compiler_bg.wasm',
  });
  $typst.setRendererInitOptions({
    getModule: () => '/wasm/typst_ts_renderer_bg.wasm',
  });
} catch (e) {
  // Already initialized or configured
}

interface TypstRendererProps {
  code: string;
}

export default function TypstRenderer({ code }: TypstRendererProps) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    const render = async () => {
      try {
        const svgOutput = await $typst.svg({ mainContent: code });
        if (mounted) {
          setSvg(svgOutput);
          setError('');
        }
      } catch (err: any) {
        console.error("Typst render error:", err);
        if (mounted) {
            setError(err.message || "Failed to render Typst");
        }
      }
    };

    render();

    return () => {
      mounted = false;
    };
  }, [code]);

  if (error) {
     return (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg font-mono text-xs whitespace-pre-wrap">
            <strong>Rendering Error:</strong>
            <br/>
            {error}
            <br/>
            <br/>
            <div className="text-gray-500 border-t border-red-500/20 pt-2 mt-2">
                Raw Source:
                <pre className="mt-1 overflow-x-auto">{code}</pre>
            </div>
        </div>
    );
  }

  if (!svg) {
      return (
          <div className="animate-pulse space-y-4 p-8 border border-white/5 rounded-lg bg-white/5">
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-32 bg-white/5 rounded w-full mt-4"></div>
          </div>
      );
  }

  return (
    <div 
        dangerouslySetInnerHTML={{ __html: svg }} 
        className="typst-document prose prose-invert max-w-none [&_svg]:w-full [&_svg]:h-auto bg-white p-8 rounded-lg text-black"
    />
  );
}
