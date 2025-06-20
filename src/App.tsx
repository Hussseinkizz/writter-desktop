import { useState, useEffect, useCallback } from 'react';
import { WelcomeScreen } from '@/components/welcome-screen';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { ViewLayout } from '@/components/view-layout';
import { Editor } from '@/components/new-editor';
import { Preview } from '@/components/new-preview';
import { Sidebar } from '@/components/sidebar/sidebar';
import { buildFileTree, FileNode } from '@/utils/build-tree';
import { BaseDirectory } from '@tauri-apps/plugin-fs';
import { toast } from 'sonner';

function App() {
  const [markdown, setMarkdown] = useState('# New Note!');
  const [projectDir, setProjectDir] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [unsavedPaths, setUnsavedPaths] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const handleChange = useCallback(
    (val: string) => {
      setMarkdown(val);
      // Example of tracking unsaved file
      if (selectedPath && !unsavedPaths.includes(selectedPath)) {
        setUnsavedPaths((prev) => [...prev, selectedPath]);
      }
    },
    [selectedPath, unsavedPaths]
  );

  const handleProjectChosen = async (dir: string) => {
    setProjectDir(dir);
    const tree = await buildFileTree(dir, BaseDirectory.AppLocalData);
    setFileTree(tree);
  };

  const handleFileClick = (path: string) => {
    setSelectedPath(path);
    toast('Loading file content coming soon');
  };

  const handleRename = (path: string, newName: string) => {
    toast('File renaming coming soon');
  };

  const handleDelete = (path: string) => {
    toast('File deletion coming soon');
  };

  const handleDrop = (from: string, to: string) => {
    toast('File reordering coming soon');
  };

  const handleRefresh = async () => {
    if (!projectDir) return;
    const tree = await buildFileTree(projectDir, BaseDirectory.AppLocalData);
    setFileTree(tree);
  };

  const handleSync = () => {
    toast('Sync feature coming soon');
  };

  const handleNewFile = () => {
    toast('New file creation coming soon');
  };

  const handleNewFolder = () => {
    toast('New folder creation coming soon');
  };

  if (!projectDir) {
    return <WelcomeScreen onProjectChosen={handleProjectChosen} />;
  }

  const handleSettings = () => {
    toast('Settings panel coming soon');
  };

  const handlePlayMusic = () => {
    toast('Music player coming soon');
  };

  const handleStopMusic = () => {
    toast('Music stop feature coming soon');
  };

  return (
    <section className="dark flex h-screen w-screen flex-col items-start justify-start overflow-hidden">
      <AppHeader
        showPreview={isPreviewOpen}
        togglePreview={() => setIsPreviewOpen(!isPreviewOpen)}
        musicPlaying={false}
        playMusic={handlePlayMusic}
        currentFile="note.md"
        projectName="My Project"
        openSettings={handleSettings}
      />
      <main className="flex h-[90vh] w-full flex-auto items-center justify-center overflow-hidden bg-zinc-900 text-white">
        <ViewLayout
          leftSideBarElement={
            <Sidebar
              fileTree={fileTree}
              selectedPath={selectedPath}
              unsavedPaths={unsavedPaths}
              onFileClick={handleFileClick}
              onCreateNewFile={handleNewFile}
              onCreateNewFolder={handleNewFolder}
              onRename={handleRename}
              onDelete={handleDelete}
              onDrop={handleDrop}
              onRefresh={handleRefresh}
              onSync={handleSync}
            />
          }
          showPreview={isPreviewOpen}
          middleElement={<Editor value={markdown} onChange={handleChange} />}
          rightSidebarElement={<Preview markdown={markdown} />}
        />
      </main>
      <AppFooter />
    </section>
  );
}

export default App;
