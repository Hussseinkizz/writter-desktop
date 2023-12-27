"use client";

// import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { useRouter } from 'next/router';
// import { useStore } from '@/react-hands-v2';
// import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

const AppLayout = (props: Props) => {
  // const [state, dispatch] = useStore();
  // const router = useRouter();
  // let isUserLoggedin = false;

  // useEffect(() => {
  //   if (router.pathname !== '/create-account' && !isUserLoggedin) {
  //     router.replace('/create-account');
  //   }
  // }, [isUserLoggedin, router.pathname]);

  return (
    <main
      className={
        "relative flex min-h-screen flex-col items-start justify-start bg-white"
      }
    >
      {/* The Page Content */}
      <section className="relative flex w-full flex-col items-start justify-start">
        {props.children}
      </section>
      {/* The Toast Layer */}
      {/* <Toaster position="top-center" /> */}
      <ToastContainer autoClose={5000} />
    </main>
  );
};

export default AppLayout;
