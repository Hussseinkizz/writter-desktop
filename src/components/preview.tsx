import MilkdownEditor from "./milkdown-crepe";

interface Props {
  markdownContent: string;
  onMarkdownContentChange: (content: string) => void;
}

export const PreviewComponent = (props: Props) => {
  return (
    <section className="flex h-full min-h-full w-[30%] flex-auto">
      <div className="--py-4 flex w-full flex-col gap-2 bg-zinc-900 px-4 text-white">
        <MilkdownEditor
          onMount={() => {
            console.log("preview editor crepe ready!");
          }}
          content={props.markdownContent}
          onChange={props.onMarkdownContentChange}
        />
      </div>
    </section>
  );
};
