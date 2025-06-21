import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

interface Props {
  leftSideBarElement: React.ReactNode;
  middleElement: React.ReactNode;
  rightSidebarElement: React.ReactNode;
  showPreview?: boolean;
  selectedPath: boolean;
}

export const ViewLayout = (props: Props) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full dark w-full">
      <ResizablePanel defaultSize={20}>
        <div className="flex h-full w-full items-center justify-center">
          {props.leftSideBarElement}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      {props.selectedPath ? (
        <>
          <ResizablePanel defaultSize={80}>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={40}>
                <div className="flex h-full w-full items-center justify-center">
                  {props.middleElement}
                </div>
              </ResizablePanel>
              {props.showPreview && (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={40}>
                    <div className="flex h-full w-full items-center justify-center">
                      {props.rightSidebarElement}
                    </div>
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
        </>
      ) : (
        <ResizablePanel defaultSize={80}>
          <div className="flex h-full w-full flex-col items-center justify-center text-zinc-400">
            <h2 className="text-2xl font-semibold mb-2">No file selected</h2>
            <p className="text-sm">
              Choose a file from the sidebar to get started.
            </p>
          </div>
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  );
};
