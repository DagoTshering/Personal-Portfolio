import { useCallback, useLayoutEffect, useRef, type TextareaHTMLAttributes } from 'react';

interface AutoTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
}

export default function AutoTextarea({ minRows = 3, onInput, style, ...props }: AutoTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = useCallback(() => {
    const element = textareaRef.current;
    if (!element) return;

    element.style.height = '0px';
    element.style.height = `${element.scrollHeight}px`;
  }, []);

  useLayoutEffect(() => {
    resize();
  }, [props.value, resize]);

  return (
    <textarea
      {...props}
      ref={textareaRef}
      rows={minRows}
      onInput={(event) => {
        resize();
        onInput?.(event);
      }}
      style={{
        ...style,
        overflow: 'hidden',
        resize: 'none',
      }}
    />
  );
}
