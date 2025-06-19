import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css";
import remarkBreaks from "remark-breaks";

type PreviewProps = {
  markdown: string;
};
export const Preview = (props: PreviewProps) => {
  return (
    <div className="markdown-body markdown-preview scrollbar hidden h-[90vh] w-full overflow-y-auto !bg-background p-4 sm:block">
      <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
        {props.markdown}
      </ReactMarkdown>
    </div>
  );
};
