"use client";

import React, { useState } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";

export default function CaptionEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  return (
    <div className="rounded-lg mb-2 mx-auto">
      <h2 className="text-sm/6 font-medium text-gray-900">
        Write Your Caption
      </h2>
      <div className="border p-6 rounded-lg">
        <Editor editorState={editorState} onChange={setEditorState} />
      </div>
    </div>
  );
}
