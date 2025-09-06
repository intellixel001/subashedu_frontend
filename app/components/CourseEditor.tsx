// CourseEditor.tsx
"use client";

import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface CourseEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CourseEditor({ value, onChange }: CourseEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: {},
        italic: {},
        heading: {
          levels: [2, 3],
        },
        paragraph: {},
        bulletList: false,
        orderedList: false,
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc pl-6",
          style: "list-style-type: disc; padding-left: 1.5rem;",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal pl-6",
          style: "list-style-type: decimal; padding-left: 1.5rem;",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "my-1",
        },
      }),
    ],
    content: value || "<p>Start writing your course description...</p>",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      console.log("Editor HTML:", html); // Debug output
      if (html !== value) {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class:
          "course-editor prose max-w-none text-foreground p-4 min-h-[150px] focus:outline-none bg-card rounded-md dark:text-foreground dark:bg-card",
        style: "font-weight: normal;",
      },
    },
  });

  // Sync editor content with value prop
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(
        `<p style="color: oklch(0.97 0.02 270);"> ${value}</p>` ||
          "<p>Start writing your course description...</p>"
      );
    }
  }, [value, editor]);

  // Clear placeholder on focus
  const handleFocus = () => {
    if (
      editor &&
      editor.getHTML() === "<p>Start writing your course description...</p>"
    ) {
      editor.commands.setContent("");
    }
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border border-border rounded-md p-2 bg-muted dark:border-border dark:bg-muted">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor?.can().toggleBold()}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
            editor?.isActive("bold")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-primary/10 hover:text-primary dark:text-muted-foreground dark:hover:bg-primary/10 dark:hover:text-primary"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editor?.can().toggleItalic()}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
            editor?.isActive("italic")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-primary/10 hover:text-primary dark:text-muted-foreground dark:hover:bg-primary/10 dark:hover:text-primary"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          disabled={!editor?.can().toggleBulletList()}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
            editor?.isActive("bulletList")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-primary/10 hover:text-primary dark:text-muted-foreground dark:hover:bg-primary/10 dark:hover:text-primary"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          • Bullet List
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          disabled={!editor?.can().toggleOrderedList()}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
            editor?.isActive("orderedList")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-primary/10 hover:text-primary dark:text-muted-foreground dark:hover:bg-primary/10 dark:hover:text-primary"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          1. Ordered List
        </button>
        <button
          type="button"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={!editor?.can().toggleHeading({ level: 2 })}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
            editor?.isActive("heading", { level: 2 })
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-primary/10 hover:text-primary dark:text-muted-foreground dark:hover:bg-primary/10 dark:hover:text-primary"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          disabled={!editor?.can().toggleHeading({ level: 3 })}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
            editor?.isActive("heading", { level: 3 })
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-primary/10 hover:text-primary dark:text-muted-foreground dark:hover:bg-primary/10 dark:hover:text-primary"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setParagraph().run()}
          disabled={!editor?.can().setParagraph()}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
            editor?.isActive("paragraph")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-primary/10 hover:text-primary dark:text-muted-foreground dark:hover:bg-primary/10 dark:hover:text-primary"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          ¶ Paragraph
        </button>
      </div>

      {/* Editor Content */}
      <div className="border border-border rounded-md bg-card focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all duration-200 dark:border-border dark:bg-card dark:focus-within:ring-primary dark:focus-within:border-primary">
        <EditorContent
          editor={editor}
          onFocus={handleFocus}
          className="focus:outline-none"
        />
      </div>
    </div>
  );
};