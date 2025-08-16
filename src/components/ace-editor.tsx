import AceEditor from 'react-ace';

// Import modes and themes you want
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/ext-language_tools';

// Themes
import 'ace-builds/src-noconflict/theme-one_dark';
import 'ace-builds/src-noconflict/ext-inline_autocomplete';
import 'ace-builds/src-noconflict/ext-spellcheck';

// Additional useful extensions
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/ext-linking';

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  theme?: string; // Allow theme switching
};

export const MarkdownEditor = ({
  value,
  onChange,
  theme = 'one_dark',
}: EditorProps) => {
  return (
    <div style={{ padding: '2rem 1rem', height: '90vh', width: '100%' }}>
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
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          useWorker: true,
          showLineNumbers: false,
          tabSize: 2,
          wrap: true,
          fontSize: 'clamp(16px, 2.5vw, 18px)',
          fontFamily:
            "'SF Pro Text', 'Segoe UI', 'Roboto', 'Inter', 'Helvetica Neue', 'Arial', sans-serif",
          showPrintMargin: false,
          highlightActiveLine: false,
          showGutter: false,
          animatedScroll: true,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: false,
          cursorStyle: 'ace',
          enableSnippets: true,
          dragEnabled: true,
          spellcheck: true,
          enableEmmet: true,
          enableLinking: true,
          copyWithEmptySelection: true,
          useSoftTabs: true,
          enableMultiselect: true,
          behavioursEnabled: true,
          wrapBehavioursEnabled: true,
          autoScrollEditorIntoView: true,
          fixedWidthGutter: false,
          fadeFoldWidgets: true,
        }}
        width="100%"
        height="calc(90vh - 4rem)"
        style={{
          background: 'transparent',
        }}
      />
    </div>
  );
};
