import Image from "next/image";
import Markdown from "react-markdown";

export default function MarkdownWrapper({ children }) {
    return (
        <Markdown components={{
            ol: ({ children }) => <ol className="list-decimal list-inside">{children}</ol>,
            ul: ({ children }) => <ul className="list-disc list-inside">{children}</ul>,
        }}>
            { children || "Nothing to preview"}
        </Markdown>
    );
}