import { useState, useCallback, useEffect, useRef } from 'react';
import { WelcomeScreen } from '@/components/welcome-screen';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { ViewLayout } from '@/components/view-layout';
// import { Editor } from '@/components/new-editor';
import { MarkdownEditor as Editor } from '@/components/ace-editor';
import { Preview } from '@/components/new-preview';
import { UIWPreview } from '@/components/uiw-preview';
import { Sidebar } from '@/components/sidebar/sidebar';
import { CreateFileDialog } from '@/components/sidebar/create-file-dialog';
import { CreateFolderDialog } from '@/components/sidebar/create-folder-dialog';
import { SettingsDialog } from '@/components/settings/settings-dialog';
import {
  NotificationsDialog,
  Notification,
} from '@/components/notifications-dialog';
import { buildFileTree, FileNode } from '@/utils/build-tree';
import { toast } from 'sonner';
import { open } from '@tauri-apps/plugin-dialog';
import { listen } from '@tauri-apps/api/event';
import {
  getFileContent,
  saveToFile,
  deleteFile,
  renameFile,
  moveFile,
  createFile,
  createFolder,
} from '@/utils/file-handlers';
import { useSettings } from '@/hooks/use-settings';
import { LoadingScreen } from './components/loading-screen';
import { pluginManager } from '@/plugins/plugin-manager';
import { builtInPlugins } from '@/plugins/built-in-plugins';

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [projectName, setProjectName] = useState<string>('Unknown');
  const [currentFile, setCurrentFile] = useState<string>('Unknown');
  const [musicPlaying, setMusicPlaying] = useState<boolean>(false);

  const [createFileOpen, setCreateFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [createFileError, setCreateFileError] = useState<string | undefined>(
    undefined
  );
  const [createFileParentPath, setCreateFileParentPath] = useState<
    string | null
  >(null);

  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [createFolderError, setCreateFolderError] = useState<
    string | undefined
  >(undefined);
  const [createFolderParentPath, setCreateFolderParentPath] = useState<
    string | null
  >(null);

  const [wordCount, setWordCount] = useState(
    selectedPath ? countWords(markdown) : 0
  );
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize plugin system
  useEffect(() => {
    // Register built-in plugins
    builtInPlugins.forEach((plugin) => {
      pluginManager.registerPlugin(plugin);
    });

    // Load plugin configuration from localStorage
    pluginManager.loadPluginConfig();

    // Cleanup on unmount
    return () => {
      pluginManager.savePluginConfig();
    };
  }, []);

  const handleSaveFile = useCallback(async () => {
    if (!selectedPath) {
      toast('No file selected to save!');
      return;
    }
    try {
      await saveToFile(selectedPath, markdown, projectDir || undefined);
      setUnsavedPaths((prev) => prev.filter((p) => p !== selectedPath));
      toast('File saved!');
    } catch {
      toast('Failed to save file!');
    }
  }, [selectedPath, markdown, projectDir]);

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
          saveToFile(selectedPath, val, projectDir || undefined)
            .then(() =>
              setUnsavedPaths((prev) => prev.filter((p) => p !== selectedPath))
            )
            .catch(() => toast('Auto-save failed!'));
        }, 1000);
      }
    },
    [autoSave, selectedPath, unsavedPaths, projectDir]
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [selectedPath]);

  const handleProjectChosen = async (dir: string) => {
    await setLastProjectDir(dir); // ✅ persist dir to store
    setProjectName(dir.split('/').pop() || 'New Project');
    const tree = await buildFileTree(dir);
    setFileTree(tree);
  };

  const saveCurrentFile = useCallback(
    async (content?: string) => {
      if (!selectedPath) return;
      try {
        await saveToFile(
          selectedPath,
          content ?? markdown,
          projectDir || undefined
        );
        setUnsavedPaths((prev) => prev.filter((p) => p !== selectedPath));
      } catch {
        toast('Failed to save file!');
      }
    },
    [selectedPath, markdown, projectDir]
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
      const content = await getFileContent(path, projectDir || undefined);
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
    [selectedPath, unsavedPaths, saveCurrentFile, projectDir]
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

  const handleMove = async (fromPath: string, toFolderPath: string) => {
    try {
      const fileName = fromPath.split('/').pop();
      const newPath = `${toFolderPath}/${fileName}`;
      await moveFile(fromPath, newPath);
      toast('File moved successfully!');
      handleRefresh();

      // Update selected path if the moved file was selected
      if (selectedPath === fromPath) {
        setSelectedPath(newPath);
        setCurrentFile(fileName || 'Unknown');
      }
    } catch {
      toast('Failed to move file!');
    }
  };

  const handleRefresh = async () => {
    if (!projectDir) return;
    const tree = await buildFileTree(projectDir);
    setFileTree(tree);
  };

  const handleSync = () => toast('Sync feature coming soon');

  const showCreateFileDialog = () => {
    setCreateFileError(undefined);
    setNewFileName('');
    setCreateFileParentPath(projectDir || '');
    setCreateFileOpen(true);
  };

  const showCreateFileInFolderDialog = (folderPath: string) => {
    setCreateFileError(undefined);
    setNewFileName('');
    setCreateFileParentPath(folderPath);
    setCreateFileOpen(true);
  };

  const showCreateFolderDialog = () => {
    setCreateFolderError(undefined);
    setNewFolderName('');
    setCreateFolderParentPath(projectDir || '');
    setCreateFolderOpen(true);
  };

  const showCreateFolderInFolderDialog = (folderPath: string) => {
    setCreateFolderError(undefined);
    setNewFolderName('');
    setCreateFolderParentPath(folderPath);
    setCreateFolderOpen(true);
  };

  const confirmCreateFile = async () => {
    if (!newFileName.trim()) {
      setCreateFileError('File name cannot be empty');
      return;
    }
    const parentPath = createFileParentPath || projectDir;
    if (!parentPath) {
      setCreateFileError('No parent directory specified');
      return;
    }

    try {
      // Auto-append .md extension if not present
      let fileName = newFileName.trim();
      if (!fileName.endsWith('.md') && !fileName.endsWith('.txt')) {
        fileName += '.md';
      }

      const filePath = `${parentPath}/${fileName}`;
      await createFile(
        filePath,
        '# New Note\n\nStart writing your thoughts here...\n',
        projectDir || undefined
      );
      setCreateFileOpen(false);
      setNewFileName('');
      setCreateFileError(undefined);
      setCreateFileParentPath(null);
      toast('File created successfully!');

      // Refresh the file tree
      await handleRefresh();

      // Auto-open the newly created file
      setTimeout(async () => {
        const content = await getFileContent(filePath, projectDir || undefined);
        if (content !== null) {
          setMarkdown(content);
          setWordCount(countWords(content));
          setCurrentFile(fileName);
          setSelectedPath(filePath);
          setUnsavedPaths((prev) => prev.filter((p) => p !== filePath));
        }
      }, 100); // Small delay to ensure file tree is refreshed
    } catch {
      setCreateFileError('Failed to create file!');
    }
  };

  const handleNewFolder = () => {
    setCreateFolderError(undefined);
    setNewFolderName('');
    setCreateFolderParentPath(projectDir || '');
    setCreateFolderOpen(true);
  };

  const confirmCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setCreateFolderError('Folder name cannot be empty');
      return;
    }
    const parentPath = createFolderParentPath || projectDir;
    if (!parentPath) {
      setCreateFolderError('No parent directory specified');
      return;
    }

    try {
      const folderPath = `${parentPath}/${newFolderName.trim()}`;
      await createFolder(folderPath);
      setCreateFolderOpen(false);
      setNewFolderName('');
      setCreateFolderError(undefined);
      setCreateFolderParentPath(null);
      toast('Folder created successfully!');

      // Refresh the file tree
      await handleRefresh();
    } catch {
      setCreateFolderError('Failed to create folder!');
    }
  };

  const handleChangeFolder = async () => {
    const dir = await open({ directory: true });
    if (typeof dir === 'string') {
      handleProjectChosen(dir);
      setSelectedPath(null);
      setCurrentFile('Unknown');
    }
  };

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to Writter!',
      message:
        'Thanks for using Writter Desktop. Check out the new features like background music and todo manager.',
      type: 'info',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      read: false,
    },
    {
      id: '2',
      title: 'File Auto-saved',
      message: 'Your document has been automatically saved.',
      type: 'success',
      timestamp: new Date(Date.now() - 60000), // 1 minute ago
      read: false,
    },
  ]);

  const handleSettings = () => setSettingsOpen(true);
  const handleOpenNotifications = () => setNotificationsOpen(true);
  const handlePlayMusic = () => toast('Music player coming soon');
  const handleMusicStateChange = (playing: boolean) => setMusicPlaying(playing);

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const hasLoadedProject = useRef(false);

  useEffect(() => {
    if (settingsLoaded && projectDir && !hasLoadedProject.current) {
      hasLoadedProject.current = true;
      handleProjectChosen(projectDir);
    }
  }, [settingsLoaded, projectDir]);

  // Listen for file open requests from OS (when app is opened with a file)
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupFileOpenListener = async () => {
      try {
        unlisten = await listen<string>('open-file-request', async (event) => {
          const filePath = event.payload;

          // Set the project directory to the parent folder of the opened file
          const parentDir = filePath.substring(0, filePath.lastIndexOf('/'));
          await setLastProjectDir(parentDir);
          setProjectName(parentDir.split('/').pop() || 'Project');

          // Build file tree for the parent directory
          const tree = await buildFileTree(parentDir);
          setFileTree(tree);

          // Open the specific file
          const content = await getFileContent(filePath, parentDir);
          if (content !== null) {
            setMarkdown(content);
            setWordCount(countWords(content));
            setCurrentFile(filePath.split('/').pop() || 'Unknown');
            setSelectedPath(filePath);
            setUnsavedPaths((prev) => prev.filter((p) => p !== filePath));
            toast(`Opened file: ${filePath.split('/').pop()}`);
          }
        });
      } catch (error) {
        console.error('Failed to setup file open listener:', error);
      }
    };

    if (settingsLoaded) {
      setupFileOpenListener();
    }

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [settingsLoaded, setLastProjectDir]);

  // Handle inserting content from markdown utilities
  const handleInsertContent = useCallback(
    (content: string) => {
      setMarkdown((prev) => {
        const newContent = prev + '\n\n' + content;
        setWordCount(countWords(newContent));
        if (selectedPath && !unsavedPaths.includes(selectedPath)) {
          setUnsavedPaths((prevPaths) => [...prevPaths, selectedPath]);
        }
        return newContent;
      });
      toast.success('Content inserted successfully!');
    },
    [selectedPath, unsavedPaths]
  );

  if (!settingsLoaded) {
    return <LoadingScreen />;
  }

  if (settingsLoaded && !projectDir) {
    return <WelcomeScreen onProjectChosen={handleProjectChosen} />;
  }

  return (
    <>
      <section className="dark flex h-screen w-screen flex-col items-start justify-start overflow-hidden">
        <AppHeader
          selectedPath={!!selectedPath}
          showPreview={isPreviewOpen}
          togglePreview={() => setIsPreviewOpen(!isPreviewOpen)}
          musicPlaying={musicPlaying}
          currentFile={currentFile}
          projectName={projectName}
          saveFile={handleSaveFile}
          autoSave={autoSave}
          onAutoSave={setAutoSave}
          onInsertContent={handleInsertContent}
          onMusicStateChange={handleMusicStateChange}
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
                onCreateFileInFolder={showCreateFileInFolderDialog}
                onCreateFolderInFolder={showCreateFolderInFolderDialog}
                onRename={handleRename}
                onDelete={handleDelete}
                onMove={handleMove}
                onRefresh={handleRefresh}
                onSync={handleSync}
              />
            }
            selectedPath={!!selectedPath}
            showPreview={isPreviewOpen}
            middleElement={<Editor value={markdown} onChange={handleChange} />}
            rightSidebarElement={<UIWPreview markdown={markdown} />}
          />
        </main>
        <AppFooter wordCount={wordCount} />
      </section>

      <CreateFileDialog
        open={createFileOpen}
        setOpen={setCreateFileOpen}
        parentPath={createFileParentPath || projectDir || ''}
        fileName={newFileName}
        setFileName={setNewFileName}
        confirmCreate={confirmCreateFile}
        errorMessage={createFileError}
      />

      <CreateFolderDialog
        open={createFolderOpen}
        setOpen={setCreateFolderOpen}
        parentPath={createFolderParentPath || projectDir || ''}
        folderName={newFolderName}
        setFolderName={setNewFolderName}
        confirmCreate={confirmCreateFolder}
        errorMessage={createFolderError}
      />

      {/* TODO: Uncomment when settings functionality is ready
      <SettingsDialog 
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        trigger={null}
      />
      */}

      {/* TODO: Uncomment when notifications functionality is ready
      <NotificationsDialog
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onDeleteNotification={handleDeleteNotification}
        onClearAll={handleClearAllNotifications}
      />
      */}
    </>
  );
}

export default App;
