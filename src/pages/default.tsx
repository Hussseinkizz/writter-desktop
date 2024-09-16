import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { EditorComponent, getContent, setContent } from "@/components/editor";
import { PreviewComponent } from "@/components/preview";
import { SideBarComponent } from "@/components/sidebar";
import { ViewLayout } from "@/components/view-layout";
import { useEffect, useState } from "react";
import hotkeys from "hotkeys-js";

export default function Default() {
  const [markdown, setMarkdown] = useState("# Type your markdown here");

  const saveContent = () => {
    console.log("saving...");
    let content = getContent();
    console.log("content::", content);
    // setContent("# something new!");
  };

  const globalShortCuts = {
    "ctrl+s": saveContent,
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

  return (
    <section className="dark flex h-screen w-screen flex-col items-start justify-start overflow-hidden">
      {/* The Header */}
      <AppHeader />
      <main className="flex h-[90vh] w-full flex-auto items-center justify-center overflow-hidden bg-zinc-900 text-white">
        <ViewLayout
          leftSideBarElement={<SideBarComponent />}
          middleElement={
            <EditorComponent
              content={markdown}
              onContentChange={(data) => setMarkdown(data)}
            />
          }
          rightSidebarElement={
            <PreviewComponent
              markdownContent={markdown}
              onMarkdownContentChange={(data) => setMarkdown(data)}
            />
          }
        />
      </main>
      <AppFooter />
    </section>
  );
}
