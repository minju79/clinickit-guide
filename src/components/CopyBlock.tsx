import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyBlockProps {
  content: string;
  label?: string;
  language?: string;
}

export function CopyBlock({ content, label, language }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg border border-border bg-secondary/50 overflow-hidden">
      {label && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-secondary/80">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          {language && <span className="text-[10px] text-muted-foreground/60">{language}</span>}
        </div>
      )}
      <div className="p-4 pr-12">
        <pre className="text-sm font-mono text-foreground/85 whitespace-pre-wrap break-words leading-relaxed">{content}</pre>
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="복사"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
