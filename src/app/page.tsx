"use client";

import { useEffect } from "react";
import marketingBody from "./_marketingBody";
import { initMarketing } from "./_marketingScript";
import "./marketing.css";

export default function Home() {
  useEffect(() => {
    initMarketing();
  }, []);

  return (
    <div
      className="blitzmind-marketing"
      dangerouslySetInnerHTML={{ __html: marketingBody }}
    />
  );
}
