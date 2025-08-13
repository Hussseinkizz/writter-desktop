import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  leftSideBarElement: React.ReactNode;
  middleElement: React.ReactNode;
  rightSidebarElement: React.ReactNode;
  showPreview?: boolean;
  selectedPath: boolean;
}

/**
 * ViewLayout component that manages the main layout with sidebar, editor, and preview
 * Includes subtle animations for better user experience
 */
export const ViewLayout = (props: Props) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full dark w-full">
      <ResizablePanel defaultSize={20}>
        <motion.div 
          className="flex h-full w-full items-center justify-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {props.leftSideBarElement}
        </motion.div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      {props.selectedPath ? (
        <>
          <ResizablePanel defaultSize={80}>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={40}>
                <motion.div 
                  className="flex h-full w-full items-center justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
                >
                  {props.middleElement}
                </motion.div>
              </ResizablePanel>
              <AnimatePresence>
                {props.showPreview && (
                  <>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={40}>
                      <motion.div 
                        className="flex h-full w-full items-center justify-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {props.rightSidebarElement}
                      </motion.div>
                    </ResizablePanel>
                  </>
                )}
              </AnimatePresence>
            </ResizablePanelGroup>
          </ResizablePanel>
        </>
      ) : (
        <ResizablePanel defaultSize={80}>
          <motion.div 
            className="flex h-full w-full flex-col items-center justify-center text-zinc-400"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.h2 
              className="text-2xl font-semibold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            >
              No file selected
            </motion.h2>
            <motion.p 
              className="text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
            >
              Choose a file from the sidebar to get started.
            </motion.p>
          </motion.div>
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  );
};
