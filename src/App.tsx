import { useState, useCallback, useEffect, useRef } from 'react';
import { WelcomeScreen } from '@/components/welcome-screen';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { ViewLayout } from '@/components/view-layout';
import { Editor } from '@/components/new-editor';
import { Preview } from '@/components/new-preview';
import { Sidebar } from '@/components/sidebar/sidebar';
import { CreateFileDialog } from '@/components/sidebar/create-file-dialog';
import { buildFileTree, FileNode } from '@/utils/build-tree';
import { BaseDirectory } from '@tauri-apps/plugin-fs';
import { toast } from 'sonner';
import { open } from '@tauri-apps/plugin-dialog';
import {
  getFileContent,
  saveToFile,
  deleteFile,
  renameFile,
  moveFile,
  createFile,
} from '@/utils/file-handlers';
import { useSettings } from '@/hooks/use-settings';

function countWords(text: string): number {
  return text.trim().replace(/\s+/g, ' ').split(' ').filter(Boolean).length;
}

function App() {
  const {
    loaded: settingsLoaded,
    lastProjectDir: projectDir,
    setLastProjectDir,
    autoSave,
    setAutoSave,
  } = useSettings();

  const [markdown, setMarkdown] = useState('# New Note!');
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [unsavedPaths, setUnsavedPaths] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [projectName, setProjectName] = useState<string>('Unknown');
  const [currentFile, setCurrentFile] = useState<string>('Unknown');

  const [createFileOpen, setCreateFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [createFileError, setCreateFileError] = useState<string | undefined>(
    undefined
  );

  const [wordCount, setWordCount] = useState(countWords(markdown));
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSaveFile = useCallback(async () => {
    if (!selectedPath) {
      toast('No file selected to save!');
      return;
    }
    try {
      await saveToFile(selectedPath, markdown);
      setUnsavedPaths((prev) => prev.filter((p) => p !== selectedPath));
      toast('File saved!');
    } catch {
      toast('Failed to save file!');
    }
  }, [selectedPath, markdown]);

  const handleChange = useCallback(
    (val: string) => {
      setMarkdown(val);
      setWordCount(countWords(val));
      if (selectedPath && !unsavedPaths.includes(selectedPath)) {
        setUnsavedPaths((prev) => [...prev, selectedPath]);
      }
      if (autoSave && selectedPath) {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
          saveToFile(selectedPath, val)
            .then(() =>
              setUnsavedPaths((prev) => prev.filter((p) => p !== selectedPath))
            )
            .catch(() => toast('Auto-save failed!'));
        }, 1000);
      }
    },
    [autoSave, selectedPath, unsavedPaths]
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [selectedPath]);

  const handleProjectChosen = async (dir: string) => {
    await setLastProjectDir(dir); // ✅ persist dir to store
    setProjectName(dir.split('/').pop() || 'New Project');
    const tree = await buildFileTree(dir, BaseDirectory.AppLocalData);
    setFileTree(tree);
  };

  const saveCurrentFile = useCallback(
    async (content?: string) => {
      if (!selectedPath) return;
      try {
        await saveToFile(selectedPath, content ?? markdown);
        setUnsavedPaths((prev) => prev.filter((p) => p !== selectedPath));
      } catch {
        toast('Failed to save file!');
      }
    },
    [selectedPath, markdown]
  );

  const handleFileClick = useCallback(
    async (path: string) => {
      if (selectedPath && unsavedPaths.includes(selectedPath)) {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
          debounceTimer.current = null;
        }
        await saveCurrentFile();
      }
      const content = await getFileContent(path);
      if (content === null) {
        toast("Oops! We Couldn't Open That!");
        return;
      }
      setMarkdown(content || '');
      setWordCount(countWords(content));
      setCurrentFile(path.split('/').pop() || 'Unknown');
      setSelectedPath(path);
      setUnsavedPaths((prev) => prev.filter((p) => p !== path));
    },
    [selectedPath, unsavedPaths, saveCurrentFile]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveFile();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSaveFile]);

  const handleRename = async (path: string, newName: string) => {
    const parentDir = path.substring(0, path.lastIndexOf('/'));
    const newPath = `${parentDir}/${newName}`;
    try {
      await renameFile(path, newPath);
      toast('File renamed!');
      handleRefresh();
      if (selectedPath === path) {
        setSelectedPath(newPath);
        setCurrentFile(newName);
      }
    } catch {
      toast('Failed to rename file!');
    }
  };

  const handleDelete = async (path: string) => {
    try {
      await deleteFile(path);
      toast('File deleted!');
      handleRefresh();
      if (selectedPath === path) {
        setSelectedPath(null);
        setMarkdown('# New Note!');
        setCurrentFile('Unknown');
        setWordCount(countWords('# New Note!'));
      }
    } catch {
      toast('Failed to delete file!');
    }
  };

  const handleDrop = async (from: string, to: string) => {
    toast('Notes reordering coming soon!');
  };

  const handleRefresh = async () => {
    if (!projectDir) return;
    const tree = await buildFileTree(projectDir, BaseDirectory.AppLocalData);
    setFileTree(tree);
  };

  const handleSync = () => toast('Sync feature coming soon');

  const showCreateFileDialog = () => {
    setCreateFileError(undefined);
    setNewFileName('');
    setCreateFileOpen(true);
  };

  const confirmCreateFile = async () => {
    if (!newFileName.trim()) {
      setCreateFileError('File name cannot be empty');
      return;
    }
    if (!projectDir) {
      setCreateFileError('No project directory');
      return;
    }
    try {
      const filePath = `${projectDir}/${newFileName}`;
      await createFile(filePath, '');
      setCreateFileOpen(false);
      setNewFileName('');
      setCreateFileError(undefined);
      toast('File created!');
      await handleRefresh();
    } catch {
      setCreateFileError('Failed to create file!');
    }
  };

  const handleNewFolder = () => toast('New folder creation coming soon');

  const handleChangeFolder = async () => {
    const dir = await open({ directory: true });
    if (typeof dir === 'string') {
      handleProjectChosen(dir);
    }
  };

  const handleSettings = () => toast('Settings panel coming soon');
  const handlePlayMusic = () => toast('Music player coming soon');
  const handleStopMusic = () => toast('Music stop feature coming soon');

  // Wait for settings to load before rendering
  if (!settingsLoaded) return null;

  if (!projectDir) {
    return <WelcomeScreen onProjectChosen={handleProjectChosen} />;
  }

  return (
    <>
      <section className="dark flex h-screen w-screen flex-col items-start justify-start overflow-hidden">
        <AppHeader
          selectedPath={!!selectedPath}
          showPreview={isPreviewOpen}
          togglePreview={() => setIsPreviewOpen(!isPreviewOpen)}
          musicPlaying={false}
          playMusic={handlePlayMusic}
          currentFile={currentFile}
          projectName={projectName}
          openSettings={handleSettings}
          saveFile={handleSaveFile}
          autoSave={autoSave}
          onAutoSave={setAutoSave}
        />
        <main className="flex h-[90vh] w-full flex-auto items-center justify-center overflow-hidden bg-zinc-900 text-white">
          <ViewLayout
            leftSideBarElement={
              <Sidebar
                changeFolder={handleChangeFolder}
                openSettings={handleSettings}
                fileTree={fileTree}
                selectedPath={selectedPath}
                unsavedPaths={unsavedPaths}
                onFileClick={handleFileClick}
                onCreateNewFile={showCreateFileDialog}
                onCreateNewFolder={handleNewFolder}
                onRename={handleRename}
                onDelete={handleDelete}
                onDrop={handleDrop}
                onRefresh={handleRefresh}
                onSync={handleSync}
              />
            }
            selectedPath={!!selectedPath}
            showPreview={isPreviewOpen}
            middleElement={<Editor value={markdown} onChange={handleChange} />}
            rightSidebarElement={<Preview markdown={markdown} />}
          />
        </main>
        <AppFooter wordCount={wordCount} />
      </section>

      <CreateFileDialog
        open={createFileOpen}
        setOpen={setCreateFileOpen}
        parentPath={projectDir}
        fileName={newFileName}
        setFileName={setNewFileName}
        confirmCreate={confirmCreateFile}
        errorMessage={createFileError}
      />
    </>
  );
}

export default App;
