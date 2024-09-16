import React, { useEffect, useRef } from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "../../node_modules/@milkdown/crepe/src/theme/frame-dark/style.css"; // Or your custom theme
// import "./your-theme.css"; // Custom theme

interface Props {
  content: string;
  onChange: (content: string) => void;
  onMount?: () => void;
}

const MilkdownEditor = (props: Props) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const crepe = new Crepe({
      root: editorRef.current,
      defaultValue: props.content,
    });

    crepe.create().then(() => {
      props.onMount?.();
    });

    // Cleanup function to destroy the editor on component unmount
    return () => {
      crepe.destroy();
    };
  }, []);

  return <div id="app" ref={editorRef}></div>;
};

export default MilkdownEditor;
