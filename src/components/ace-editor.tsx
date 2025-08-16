import AceEditor from "react-ace";

// Import modes and themes you want
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/ext-language_tools";

// Themes
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/ext-inline_autocomplete";
import "ace-builds/src-noconflict/ext-spellcheck";

// Additional useful extensions
import "ace-builds/src-noconflict/ext-searchbox";
import "ace-builds/src-noconflict/ext-linking";

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  theme?: string; // Allow theme switching
};

export const MarkdownEditor = ({
  value,
  onChange,
  theme = "one_dark",
}: EditorProps) => {
  return (
    <div style={{ padding: "2rem 1rem", height: "90vh", width: "100%" }}>
      <style>
        {`
          .ace_editor .ace_markup.ace_heading {
            color: #a78bfa !important;
            font-weight: bold !important;
          }
          .ace_editor .ace_heading {
            color: #a78bfa !important;
            font-weight: bold !important;
          }
          .ace_editor .ace_string.ace_other.ace_link.ace_underline {
            color: #a78bfa !important;
          }
        `}
      </style>
      <AceEditor
        mode="markdown"
        theme={theme}
        value={value}
        onChange={onChange}
        name="markdown-editor"
        editorProps={{
          $blockScrolling: Infinity,
          $useWorker: false,
        }}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
          wrap: true,
          fontSize: "clamp(16.5px, 2vw, 17px)",
          fontFamily:
            "'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Courier New', monospace",
          showPrintMargin: false,
          highlightActiveLine: false,
          showGutter: false,
          cursorStyle: "ace",
          enableBasicAutocompletion: true,
          behavioursEnabled: true,
          enableSnippets: true,
          animatedScroll: true,
          spellcheck: true,
        }}
        width="100%"
        height="calc(90vh - 4rem)"
        style={{
          background: "transparent",
        }}
      />
    </div>
  );
};
