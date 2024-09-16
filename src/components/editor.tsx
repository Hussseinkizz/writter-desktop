import { useRef } from "react";
import Editor from "@monaco-editor/react";

interface Props {
  content: string;
  onContentChange: (newValue: string) => void;
}

let editorInstance: any = null;

export function getContent() {
  return editorInstance?.getValue() || "";
}

export function setContent(newContent: string) {
  if (editorInstance) {
    editorInstance.setValue(newContent);
  }
}

export function EditorComponent(props: Readonly<Props>) {
  const editorRef = useRef(null);

  const handleEditorChange = (value: any) => {
    props.onContentChange(value);
  };

  // Set editor instance on mount
  const handleEditorDidMount = (editor: any) => {
    editorInstance = editor;
  };

  const options = {
    theme: "vs-dark",
    automaticLayout: true,
    wordWrapColumn: 80,
    minimap: {
      enabled: false,
    },
    scrollbar: {
      alwaysConsumeMouseWheel: false,
    },
  };

  return (
    <div className="flex h-full min-h-full w-[50%] flex-auto">
      <Editor
        theme="vs-dark"
        options={options}
        defaultLanguage="markdown"
        value={props.content}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
