import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { EditorComponent } from "@/components/editor";
import { PreviewComponent } from "@/components/preview";
import { SideBarComponent } from "@/components/sidebar";
import { useState } from "react";

export default function Default() {
  const [markdown, setMarkdown] = useState("# Type your markdown here");

  return (
    <section className="dark flex h-screen w-screen flex-col items-start justify-start overflow-hidden">
      {/* The Header */}
      <AppHeader />
      <main className="flex h-[90vh] w-full flex-auto items-center justify-center overflow-hidden bg-zinc-900 text-white">
        <SideBarComponent />
        <EditorComponent
          content={markdown}
          onContentChange={(data) => setMarkdown(data)}
        />
        <PreviewComponent markdownContent={markdown} />
      </main>
      <AppFooter />
    </section>
  );
}
