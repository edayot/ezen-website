"use client";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";



export default function MarkdownRender({children}: {children?: string}) {
    return (
        <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        className="space-y-5"
        >
        {children}
        </Markdown>
    );
}


