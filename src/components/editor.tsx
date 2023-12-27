import Editor from "@monaco-editor/react";

interface Props {
  content: string;
  onContentChange: (newValue: string) => void;
}

export function EditorComponent(props: Readonly<Props>) {
  const handleEditorChange = (value: any) => {
    props.onContentChange(value);
  };

  const options = {
    theme: "vs-dark", // Enables dark mode
    automaticLayout: true, // Automatically adjusts the layout to fit the container
    // wordWrap: "on", // Wraps lines that exceed the column limit
    wordWrapColumn: 80, // Sets the column limit
    minimap: {
      enabled: false, // Disables the minimap
    },
    scrollbar: {
      alwaysConsumeMouseWheel: false, // Allows scrolling outside the editor when the mouse wheel is pressed
    },
  };

  return (
    <div className="flex h-full min-h-full w-[50%] flex-auto">
      <Editor
        theme="vs-dark"
        options={options}
        defaultLanguage="markdown"
        defaultValue={props.content}
        onChange={handleEditorChange}
      />
    </div>
  );
}
