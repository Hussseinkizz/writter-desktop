import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface Props {
  leftSideBarElement: React.ReactNode;
  middleElement: React.ReactNode;
  rightSidebarElement: React.ReactNode;
}

export const ViewLayout = (props: Props) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel defaultSize={20}>
        <div className="flex h-full w-full items-center justify-center">
          {props.leftSideBarElement}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={40}>
            <div className="flex h-full w-full items-center justify-center">
              {props.middleElement}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}>
            <div className="flex h-full w-full items-center justify-center">
              {props.rightSidebarElement}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
