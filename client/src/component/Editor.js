import React, { useEffect } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, history } from "@codemirror/commands";
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";

function Editor({ socketRef, roomId, editorRef }) {
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
      dispatch: (tr) => {
        view.update([tr]);
        if (tr.docChanged) {
          const code = tr.newDoc.toString();
          socketRef.current.emit("codeChange", { roomId, code });
        }
      },
    });

    // Attach the view to the ref
    editorRef.current.view = view;

    return () => view.destroy();
  }, [socketRef, roomId, editorRef]);

  return (
    <div
      id="realtimeEditor"
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
