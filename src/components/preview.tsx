import Markdown from "react-markdown";

interface Props {
  markdownContent: string;
}

export const PreviewComponent = (props: Props) => {
  return (
    <div className="flex h-full min-h-full w-[30%] flex-auto">
      <Markdown className="--py-4 flex w-full flex-col gap-2 bg-zinc-900 px-4 text-white">
        {props.markdownContent}
      </Markdown>
    </div>
  );
};
