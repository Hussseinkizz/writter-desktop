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
  theme?: string;
};

// Wrap selection with prefix/suffix, or insert both with cursor placed inside
function wrapOrInsert(editor: any, prefix: string, suffix: string) {
  const selection = editor.getSelectedText();
  if (selection) {
    const range = editor.selection.getRange();
    editor.session.replace(range, `${prefix}${selection}${suffix}`);
  } else {
    const cursor = editor.getCursorPosition();
    editor.session.insert(cursor, `${prefix}${suffix}`);
    editor.moveCursorTo(cursor.row, cursor.column + prefix.length);
  }
}

const editorFormattingCommands = [
  {
    name: "bold",
    bindKey: { win: "Ctrl-B", mac: "Command-B" },
    exec: (editor: any) => wrapOrInsert(editor, "**", "**"),
  },
  {
    name: "italic",
    bindKey: { win: "Ctrl-I", mac: "Command-I" },
    exec: (editor: any) => wrapOrInsert(editor, "*", "*"),
  },
  {
    name: "link",
    bindKey: { win: "Ctrl-K", mac: "Command-K" },
    exec: (editor: any) => {
      const selection = editor.getSelectedText();
      const cursor = editor.getCursorPosition();
      if (selection) {
        const range = editor.selection.getRange();
        editor.session.replace(range, `[${selection}](url)`);
      } else {
        editor.session.insert(cursor, "[text](url)");
        // Place cursor on "text" so it can be replaced immediately
        editor.moveCursorTo(cursor.row, cursor.column + 1);
        editor.selection.selectTo(cursor.row, cursor.column + 5);
      }
    },
  },
  {
    name: "heading",
    bindKey: { win: "Ctrl-Shift-H", mac: "Command-Shift-H" },
    exec: (editor: any) => {
      const cursor = editor.getCursorPosition();
      const line = editor.session.getLine(cursor.row);
      const headingMatch = line.match(/^(#{1,6}) /);
      if (!headingMatch) {
        editor.session.insert({ row: cursor.row, column: 0 }, "# ");
      } else if (headingMatch[1].length < 6) {
        const oldLen = headingMatch[1].length;
        editor.session.replace(
          {
            start: { row: cursor.row, column: 0 },
            end: { row: cursor.row, column: oldLen },
          },
          headingMatch[1] + "#"
        );
      } else {
        // Remove heading prefix (6 hashes + space = 7 chars)
        editor.session.replace(
          {
            start: { row: cursor.row, column: 0 },
            end: { row: cursor.row, column: 7 },
          },
          ""
        );
      }
    },
  },
];

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
        commands={editorFormattingCommands}
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
