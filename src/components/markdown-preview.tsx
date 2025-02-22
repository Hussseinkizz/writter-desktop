"use client";

import React, { useState } from "react";
import type { Value } from "@udecode/plate";
import { type PlateEditor, Plate } from "@udecode/plate/react";
import { cloneDeep } from "lodash";
import { MarkdownPlugin } from "@udecode/plate-markdown";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";

export interface MarkdownPreviewProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

const markdownPlugin = MarkdownPlugin.configure({
  options: { indentList: true },
});

const MarkdownPreview = ({ editor }: { editor: PlateEditor }) => {
  return (
    <Plate editor={editor}>
      <EditorContainer className="bg-muted/50">
        <Editor variant="none" className="p-2" />
      </EditorContainer>
    </Plate>
  );
};

export default MarkdownPreview;
