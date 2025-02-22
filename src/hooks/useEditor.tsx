"use client";
import type { Value } from "@udecode/plate";

import { withProps } from "@udecode/cn";
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from "@udecode/plate-code-block/react";
import { HEADING_KEYS } from "@udecode/plate-heading";
import { HighlightPlugin } from "@udecode/plate-highlight/react";
import { HorizontalRulePlugin } from "@udecode/plate-horizontal-rule/react";
import { KbdPlugin } from "@udecode/plate-kbd/react";
import { LinkPlugin } from "@udecode/plate-link/react";
import { deserializeMd, MarkdownPlugin } from "@udecode/plate-markdown";
import { InlineEquationPlugin } from "@udecode/plate-math/react";
import { ImagePlugin } from "@udecode/plate-media/react";
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from "@udecode/plate-table/react";
import {
  type PlateEditor,
  ParagraphPlugin,
  Plate,
  PlateLeaf,
  usePlateEditor,
} from "@udecode/plate/react";
import { cloneDeep } from "lodash";
import remarkEmoji from "remark-emoji";
import { autoformatPlugin } from "@/components/editor/plugins/autoformat-plugin";
import { basicNodesPlugins } from "@/components/editor/plugins/basic-nodes-plugins";
import { indentListPlugins } from "@/components/editor/plugins/indent-list-plugins";
import { linkPlugin } from "@/components/editor/plugins/link-plugin";
import { mediaPlugins } from "@/components/editor/plugins/media-plugins";
import { tablePlugin } from "@/components/editor/plugins/table-plugin";
import { BlockquoteElement } from "@/components/plate-ui/blockquote-element";
import { CodeBlockElement } from "@/components/plate-ui/code-block-element";
import { CodeLeaf } from "@/components/plate-ui/code-leaf";
import { CodeLineElement } from "@/components/plate-ui/code-line-element";
import { CodeSyntaxLeaf } from "@/components/plate-ui/code-syntax-leaf";
import { HeadingElement } from "@/components/plate-ui/heading-element";
import { HighlightLeaf } from "@/components/plate-ui/highlight-leaf";
import { HrElement } from "@/components/plate-ui/hr-element";
import { ImageElement } from "@/components/plate-ui/image-element";
import { KbdLeaf } from "@/components/plate-ui/kbd-leaf";
import { LinkElement } from "@/components/plate-ui/link-element";
import { ParagraphElement } from "@/components/plate-ui/paragraph-element";
import {
  TableCellElement,
  TableCellHeaderElement,
} from "@/components/plate-ui/table-cell-element";
import { TableElement } from "@/components/plate-ui/table-element";
import { TableRowElement } from "@/components/plate-ui/table-row-element";
import { useEffect } from "react";

const markdownPlugin = MarkdownPlugin.configure({
  options: { indentList: true },
});

export const useEditor = (initialMarkdown: string) => {
  const editor = usePlateEditor(
    {
      override: {
        components: {
          [BlockquotePlugin.key]: BlockquoteElement,
          [BoldPlugin.key]: withProps(PlateLeaf, { as: "strong" }),
          [CodeBlockPlugin.key]: CodeBlockElement,
          [CodeLinePlugin.key]: CodeLineElement,
          [CodePlugin.key]: CodeLeaf,
          [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
          [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: "h1" }),
          [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: "h2" }),
          [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: "h3" }),
          [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: "h4" }),
          [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: "h5" }),
          [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: "h6" }),
          [HighlightPlugin.key]: HighlightLeaf,
          [HorizontalRulePlugin.key]: HrElement,
          [ImagePlugin.key]: ImageElement,
          [ItalicPlugin.key]: withProps(PlateLeaf, { as: "em" }),
          [KbdPlugin.key]: KbdLeaf,
          [LinkPlugin.key]: LinkElement,
          [ParagraphPlugin.key]: ParagraphElement,
          [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: "s" }),
          [SubscriptPlugin.key]: withProps(PlateLeaf, { as: "sub" }),
          [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: "sup" }),
          [TableCellHeaderPlugin.key]: TableCellHeaderElement,
          [TableCellPlugin.key]: TableCellElement,
          [TablePlugin.key]: TableElement,
          [TableRowPlugin.key]: TableRowElement,
          [UnderlinePlugin.key]: withProps(PlateLeaf, { as: "u" }),
        },
      },
      plugins: [
        ...basicNodesPlugins,
        HorizontalRulePlugin,
        linkPlugin,
        tablePlugin,
        ...mediaPlugins,
        InlineEquationPlugin,
        HighlightPlugin,
        KbdPlugin,
        ImagePlugin,
        ...indentListPlugins,
        autoformatPlugin,
        markdownPlugin,
      ],
      value: (editor: PlateEditor) =>
        deserializeMd(editor, initialMarkdown, {
          processor(processor) {
            return processor.use(remarkEmoji) as any;
          },
        }),
    },
    [],
  );
  return editor;
};

export function useResetEditorOnChange(
  { editor, value }: { editor: PlateEditor; value: Value },
  deps: any[],
) {
  useEffect(() => {
    if (value.length > 0) {
      editor.tf.replaceNodes(cloneDeep(value), {
        at: [],
        children: true,
      });

      editor.history.undos = [];
      editor.history.redos = [];
      editor.operations = [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
}
