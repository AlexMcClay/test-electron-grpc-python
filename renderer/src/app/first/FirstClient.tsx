"use client";

import React, { useState } from "react";

type Props = {};

const FirstClient = (props: Props) => {
  const [text, setText] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  async function handleResponse() {
    const res = await window.electronAPI.pyLayer.sayHello(text);
    setResponse(res);
  }
  return (
    <div className="flex items-center w-full">
      <div className=" w-full max-w-7xl p-2 flex flex-col gap-2">
        <input
          className="w-full border rounded shadow p-2 bg-slate-700"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleResponse();
            }
          }}
        />
        <div className="w-full bg-slate-800 rounded shadow p-2">
          <p>{response}</p>
        </div>
      </div>
    </div>
  );
};

export default FirstClient;
