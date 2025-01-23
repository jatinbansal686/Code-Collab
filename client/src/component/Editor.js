import React, { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, history } from "@codemirror/commands";
import { autocompletion } from "@codemirror/autocomplete";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";

function Editor() {
  const editorRef = useRef();
  useEffect(() => {
    const startState = EditorState.create({
      doc: "// Write your Java code here",
      extensions: [
        history(),
        java(),
        oneDark,
        EditorView.lineWrapping,
        keymap.of([...defaultKeymap, ...closeBracketsKeymap]),
        autocompletion(),
        closeBrackets(),
        lineNumbers(), // Enable line numbers
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    return () => view.destroy();
  }, []);

  return (
    <div
      ref={editorRef}
      style={{
        height: "100vh",
        backgroundColor: "#1e1e1e",
        padding: "20px",
      }}
    />
  );
}
export default Editor;
