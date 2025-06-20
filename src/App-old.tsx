import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
// import { EditorComponent, getContent, setContent } from "@/components/editor";
// import { PreviewComponent } from "@/components/preview";
import { SideBarComponent } from '@/components/sidebar/sidebar';
import { useCallback, useEffect, useState } from 'react';
import hotkeys from 'hotkeys-js';
import { ViewLayout } from '@/components/view-layout';
import { Editor } from '@/components/new-editor';
import { Preview } from '@/components/new-preview';
import { open, save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';

function App() {
  const [markdown, setMarkdown] = useState('# New Note!');

  const handleChange = useCallback((val: string) => {
    setMarkdown(val);
    // console.log(val);
  }, []);

  const saveContent = () => {
    console.log('saving...');
    // let content = getContent();
    // console.log("content::", content);
    // setContent("# something new!");
  };

  const globalShortCuts = {
    'ctrl+s': saveContent,
  };

  useEffect(() => {
    // try to prevent default event behaviors
    window.onkeyup = (event) => {
      event.preventDefault();
    };
    // Register the global shortcuts
    Object.entries(globalShortCuts).forEach(([key, callback]) => {
      hotkeys(key, (event) => {
        event.preventDefault();
        callback();
      });
    });

    // Cleanup when the component is unmounted
    return () => {
      // Unregister the global shortcuts
      Object.entries(globalShortCuts).forEach(([key, callback]) => {
        hotkeys.unbind(key);
      });
    };
  }, []);

  // todo 1: load contents from file
  // todo 2: save contents to file
  // todo 3: add a UI to save contents to file
  // todo 4: add a UI to load contents from file
  const handleOpen = async () => {
    console.log('clicked');
    try {
      // Open a file selection dialog
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: 'Text',
            extensions: ['md', 'txt'],
          },
        ],
      });

      if (selected) {
        // Read the file content using our Rust command
        const fileContent = await invoke('open_file', {
          path: selected,
        });
        console.log('fileContent:', fileContent);
        console.log('File opened successfully!');
      }
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const handleSave = async () => {
    console.log('clicked');
    try {
      // Open a file save dialog window to select the file path
      const filePath = await save({
        filters: [
          {
            name: 'Text',
            extensions: ['md', 'txt'],
          },
        ],
      });

      // If the user selects a file path, save the file
      if (filePath) {
        // Save the file using our Rust command
        await invoke('save_file', {
          content: '# Hello Tauri !!',
          path: filePath,
        });
        console.log('File saved successfully!');
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  return (
    <section className="dark flex h-screen w-screen flex-col items-start justify-start overflow-hidden">
      {/* The Header */}
      <AppHeader openFile={handleOpen} saveFile={handleSave} />
      <main className="flex h-[90vh] w-full flex-auto items-center justify-center overflow-hidden bg-zinc-900 text-white">
        <ViewLayout
          leftSideBarElement={<SideBarComponent />}
          middleElement={<Editor value={markdown} onChange={handleChange} />}
          rightSidebarElement={<Preview markdown={markdown} />}
        />
      </main>
      <AppFooter />
    </section>
  );
}

export default App;
