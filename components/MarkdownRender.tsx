"use client";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function MarkdownRender({
  children,
  disable_img,
}: {
  children?: string;
  disable_img?: boolean;
}) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      disallowedElements={disable_img ? ["img"] : []}
      className="space-y-5"
    >
      {children}
    </Markdown>
  );
}
