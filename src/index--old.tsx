'use client';
import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import { Editor } from '@/components/editor';

export default function Home() {
  return (
    <section className="w-full flex flex-col justify-start items-start min-h-screen">
      {/* The Header */}
      <AppHeader />
      <main className="flex w-full min-h-full h-full justify-center items-center flex-col flex-auto overflow-hidden">
        <Editor />
      </main>
      <AppFooter />
    </section>
  );
}
