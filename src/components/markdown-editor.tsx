import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import rehypeSanitize from "rehype-sanitize";

export default function MarkDownEditor() {
  const [value, setValue] = useState(`Hello There...`);
  return (
    <div className="flex h-full w-full flex-col">
      <MDEditor
        className="flex h-full w-full min-w-full"
        value={value}
        height="90vh"
        placeholder="what's on your mind today?"
        visibleDragbar={false}
        onChange={(value) => setValue(value || "")}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </div>
  );
}
