"use client";

import React, { useEffect, useState } from "react";

type Props = {};

const FirstClient = (props: Props) => {
  const [text, setText] = useState<string>("");
  const [response, setResponse] = useState<string[]>([]);
  const [isStreamReply, setIsStreamReply] = useState<boolean>(false);

  async function handleResponse() {
    if (!text) return;
    if (isStreamReply) {
      window.electronAPI.pyLayer.sayHelloStreamReply(text);
      return;
    }
    const res = await window.electronAPI.pyLayer.sayHello(text);
    setText("");
    setResponse((prev) => [...prev, res]);
  }

  useEffect(() => {
    window.electronAPI.pyLayer.onSayHelloStreamReply((event, res) => {
      //   console.log("onSayHelloStreamReply", res);
      setResponse((prev) => [...prev, res]);
    });

    return () => {
      window.electronAPI.pyLayer.offSayHelloStreamReply();
    };
  }, []);

  return (
    <div className="flex items-center w-full">
      <div className=" w-full max-w-7xl p-2 flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <input
            className="w-full border rounded shadow p-2 bg-slate-700
        
            "
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleResponse();
              }
            }}
          />
          {/* steamReply */}
          <input
            type="checkbox"
            className="h-5 w-5"
            checked={isStreamReply}
            onChange={(e) => setIsStreamReply(e.target.checked)}
          />
        </div>

        <div className="w-full bg-slate-800 rounded shadow p-2">
          {response.map((res, index) => (
            <p key={index}>{res}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FirstClient;
