import { useCodeMirror, basicSetup, EditorView } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { githubDark } from "@uiw/codemirror-theme-github";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import "github-markdown-css";

const markdownHighlightStyle = HighlightStyle.define([
  { tag: t.heading1, fontSize: "2em", fontWeight: "bold" },
  { tag: t.heading2, fontSize: "1.75em", fontWeight: "bold" },
  { tag: t.heading3, fontSize: "1.5em", fontWeight: "bold" },
]);

const myTheme = EditorView.theme({
  "&": {
    backgroundColor: "transparent !important",
  },
  ".cm-gutters": {
    display: "none !important",
  },
  ".cm-content": {
    fontSize: "1.2em",
    padding: "1em",
  },
  ".cm-line": {
    marginTop: "0.5em",
  },
  // Custom dark, thin scrollbar for CodeMirror
  ".cm-scroller": {
    scrollbarWidth: "thin",
    scrollbarColor: "#222 #111", // thumb, track
  },
  // Webkit Scrollbar (Chrome, Edge, Safari)
  ".cm-scroller::-webkit-scrollbar": {
    width: "8px",
    background: "#111",
  },
  ".cm-scroller::-webkit-scrollbar-thumb": {
    background: "#222",
    borderRadius: "4px",
  },
  ".cm-scroller::-webkit-scrollbar-corner": {
    background: "#111",
  },
});

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const Editor = (props: EditorProps) => {
  const { setContainer } = useCodeMirror({
    value: props.value,
    height: "90vh", // Sets a fixed height for the editor
    extensions: [
      basicSetup({
        lineNumbers: false,
      }), // Adds essential features like line numbers and bracket matching
      markdown({
        base: markdownLanguage, // Enables Markdown syntax support
        codeLanguages: languages, // Adds syntax highlighting for code blocks
        addKeymap: true, // Enables useful keyboard shortcuts
      }),
      syntaxHighlighting(markdownHighlightStyle), // Applies our custom Markdown styling
      // EditorView.lineWrapping, // Enables line wrapping
      myTheme, // Uses our transparent background theme
    ],
    // theme: resolvedTheme === "dark" ? githubDark : githubLight, // Adjusts the theme dynamically
    theme: githubDark, // Adjusts the theme dynamically
    onChange: props.onChange,
  });

  return <div ref={setContainer} className="border-r-1 w-full" />;
};
