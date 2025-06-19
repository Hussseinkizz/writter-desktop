import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
// import {} from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data";
import { abcdef } from "@uiw/codemirror-themes-all";
import { barf } from "thememirror";

const code = `# Type your markdown here`;

export default function CodeMirroEditor() {
  return (
    <CodeMirror
      height="100%"
      width="100%"
      minHeight="90vh"
      minWidth="100%"
      value={code}
      className="scrollable h-full w-full text-xl"
      placeholder="What's on your mind today?"
      basicSetup={{
        highlightActiveLine: false,
        lineNumbers: false,
        autocompletion: true,
        foldGutter: false,
        syntaxHighlighting: true,
        tabSize: 2,
      }}
      theme={barf}
      extensions={[
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          completeHTMLTags: true,
        }),
      ]}
    />
  );
}
