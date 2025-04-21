import { useCodeMirror, basicSetup, EditorView } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
});

const Editor = () => {
  const [value, setValue] = useState<string>("# Welcome to Writter!");
  const handleChange = useCallback((val: string) => setValue(val), []);

  const { setContainer } = useCodeMirror({
    value, // Uses the state we set earlier to store the Markdown content
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
      EditorView.lineWrapping, // Enables line wrapping
      myTheme, // Uses our transparent background theme
    ],
    // theme: resolvedTheme === "dark" ? githubDark : githubLight, // Adjusts the theme dynamically
    theme: githubDark, // Adjusts the theme dynamically
    onChange: handleChange, // Updates the state when the user types
  });

  return (
    <div className="w-screen py-2 sm:grid sm:grid-cols-2">
      <div>
        <div ref={setContainer} className="border-r-1" />
      </div>
      <div>
        <div className="markdown-body markdown-preview scrollbar hidden h-[90vh] overflow-y-auto !bg-background p-2 sm:block">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Editor;
