"use client";

import React, { useState } from "react";
import { canvasToMiro, JSONCanvas } from "../lib/miroJsonCanvas";

export const CanvasInput = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        let canvas: JSONCanvas;
        try {
          canvas = JSON.parse(text);
        } catch (err: any) {
          setError((err as Error).toString());
          return;
        }

        canvasToMiro(canvas);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        height: '100%',
        margin: '0 16px',
        paddingBottom: '16px',
        width: '100%',
        gap: '16px'
      }}
    >
      <textarea
        className="textarea"
        onChange={({ target }) => setText(target.value)}
        rows={6}
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
        }}
      />
      <button type="submit" className="button button-primary">
        Apply
      </button>
      {error}
    </form>
  );
};
