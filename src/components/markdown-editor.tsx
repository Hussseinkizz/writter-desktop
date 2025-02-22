"use client";

import { MarkdownPlugin } from "@udecode/plate-markdown";
import { Plate, usePlateEditor } from "@udecode/plate/react";

import { Editor, EditorContainer } from "@/components/plate-ui/editor";

const markdownPlugin = MarkdownPlugin.configure({
  options: { indentList: true },
});

export interface MarkdownEditorProps {
  /** A markdown string passed from the parent */
  initialMarkdown: string;
  /** Callback to update the markdown in the parent */
  onChange: (markdown: string) => void;
  editor: any;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialMarkdown,
  editor,
  onChange,
}) => {
  const markdownEditor = usePlateEditor({
    plugins: [markdownPlugin],
    value: [{ children: [{ text: initialMarkdown }], type: "p" }],
  });

  return (
    <Plate
      onValueChange={() => {
        onChange(
          editor.api.markdown.deserialize(
            markdownEditor.api.markdown.serialize(),
          ),
        );
      }}
      editor={markdownEditor}
    >
      <EditorContainer>
        <Editor variant="none" className="p-2 font-mono text-sm" />
      </EditorContainer>
    </Plate>
  );
};

export default MarkdownEditor;
