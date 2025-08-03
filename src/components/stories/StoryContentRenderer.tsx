"use client";

import React from "react";

interface StoryContentRendererProps {
  content: string;
  className?: string;
}

export function StoryContentRenderer({
  content,
  className = "",
}: StoryContentRendererProps) {
  return (
    <div
      className={`prose prose-sm sm:prose-base lg:prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
      style={{
        // Ensure the content styles match the editor
        wordWrap: "break-word",
        lineHeight: "1.7",
      }}
    />
  );
}

// Add global styles for the rendered content
export const StoryContentStyles = () => (
  <style jsx global>{`
    .prose h1 {
      font-size: 2.25rem;
      font-weight: 700;
      line-height: 2.5rem;
      margin: 1.5rem 0 1rem 0;
      color: #111827;
    }

    .prose h2 {
      font-size: 1.875rem;
      font-weight: 600;
      line-height: 2.25rem;
      margin: 1.25rem 0 0.75rem 0;
      color: #111827;
    }

    .prose h3 {
      font-size: 1.5rem;
      font-weight: 600;
      line-height: 2rem;
      margin: 1rem 0 0.5rem 0;
      color: #111827;
    }

    .prose h4 {
      font-size: 1.25rem;
      font-weight: 600;
      line-height: 1.75rem;
      margin: 1rem 0 0.5rem 0;
      color: #111827;
    }

    .prose h5 {
      font-size: 1.125rem;
      font-weight: 600;
      line-height: 1.75rem;
      margin: 0.75rem 0 0.5rem 0;
      color: #111827;
    }

    .prose h6 {
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.5rem;
      margin: 0.75rem 0 0.5rem 0;
      color: #111827;
    }

    .prose p {
      margin: 0.75rem 0;
      line-height: 1.7;
      color: #374151;
    }

    .prose strong {
      font-weight: 600;
      color: #111827;
    }

    .prose em {
      font-style: italic;
    }

    .prose u {
      text-decoration: underline;
    }

    .prose s {
      text-decoration: line-through;
    }

    .prose code {
      background: #f3f4f6;
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
      font-family: "JetBrains Mono", "Fira Code", "Source Code Pro", Consolas,
        "Liberation Mono", Menlo, Courier, monospace;
      font-size: 0.875em;
      color: #ef4444;
    }

    .prose ul,
    .prose ol {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }

    .prose ul {
      list-style-type: disc;
    }

    .prose ol {
      list-style-type: decimal;
    }

    .prose li {
      margin: 0.25rem 0;
      color: #374151;
    }

    .prose ul ul,
    .prose ol ol,
    .prose ul ol,
    .prose ol ul {
      margin: 0.5rem 0;
    }

    .prose blockquote {
      margin: 1.5rem 0;
      padding-left: 1rem;
      border-left: 4px solid #e5e7eb;
      font-style: italic;
      color: #6b7280;
      background: #f9fafb;
      padding: 1rem;
      border-radius: 0.375rem;
    }

    .prose blockquote p {
      margin: 0;
      color: inherit;
    }

    .prose pre {
      background: #f3f4f6;
      border-radius: 0.5rem;
      padding: 1rem;
      margin: 1rem 0;
      overflow-x: auto;
      font-family: "JetBrains Mono", "Fira Code", "Source Code Pro", Consolas,
        "Liberation Mono", Menlo, Courier, monospace;
      border: 1px solid #e5e7eb;
    }

    .prose pre code {
      background: none;
      padding: 0;
      border-radius: 0;
      color: #374151;
    }

    .prose table {
      border-collapse: collapse;
      margin: 1rem 0;
      overflow: hidden;
      table-layout: fixed;
      width: 100%;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
    }

    .prose table td,
    .prose table th {
      border: 1px solid #d1d5db;
      padding: 0.75rem;
      position: relative;
      vertical-align: top;
      text-align: left;
    }

    .prose table th {
      background-color: #f9fafb;
      font-weight: 600;
      color: #111827;
    }

    .prose table td {
      color: #374151;
    }

    .prose ul[data-type="taskList"] {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
    }

    .prose ul[data-type="taskList"] li {
      display: flex;
      align-items: flex-start;
      margin: 0.5rem 0;
    }

    .prose ul[data-type="taskList"] li > label {
      flex: 0 0 auto;
      margin-right: 0.5rem;
      user-select: none;
      cursor: pointer;
    }

    .prose ul[data-type="taskList"] li > label input[type="checkbox"] {
      margin: 0;
    }

    .prose ul[data-type="taskList"] li > div {
      flex: 1 1 auto;
    }

    .prose ul[data-type="taskList"] li[data-checked="true"] > div {
      text-decoration: line-through;
      color: #9ca3af;
    }

    .prose hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 2rem 0;
    }

    .prose img {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
      margin: 1rem 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .prose a {
      color: #2563eb;
      text-decoration: underline;
      cursor: pointer;
      transition: color 0.2s;
    }

    .prose a:hover {
      color: #1d4ed8;
    }

    .prose mark {
      background-color: #fef08a;
      border-radius: 0.125rem;
      padding: 0.125rem 0.25rem;
    }

    /* Text alignment classes */
    .prose [style*="text-align: left"] {
      text-align: left;
    }

    .prose [style*="text-align: center"] {
      text-align: center;
    }

    .prose [style*="text-align: right"] {
      text-align: right;
    }

    .prose [style*="text-align: justify"] {
      text-align: justify;
    }

    /* Color preservation */
    .prose [style*="color:"] {
      /* Preserve inline color styles */
    }

    .prose [style*="background-color:"] {
      /* Preserve inline background color styles */
    }

    /* Responsive typography */
    @media (max-width: 640px) {
      .prose h1 {
        font-size: 1.875rem;
        line-height: 2.25rem;
      }

      .prose h2 {
        font-size: 1.5rem;
        line-height: 2rem;
      }

      .prose h3 {
        font-size: 1.25rem;
        line-height: 1.75rem;
      }
    }
  `}</style>
);
