import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  return (
    <div className="editor-wrap">
      <div className="editor-toolbar row">
        <button type="button" className="muted" onClick={() => editor?.chain().focus().toggleBold().run()}>
          Bold
        </button>
        <button type="button" className="muted" onClick={() => editor?.chain().focus().toggleItalic().run()}>
          Italic
        </button>
        <button type="button" className="muted" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          Bullet
        </button>
        <button type="button" className="muted" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
      </div>
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
