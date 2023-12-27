import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

// Our <Editor> component we can reuse later
export function Editor() {
  // Creates a new editor instance.
  const editor: BlockNoteEditor | null = useBlockNote({});

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      theme="dark"
      className="h-full min-h-[90vh] w-full"
    />
  );
}
