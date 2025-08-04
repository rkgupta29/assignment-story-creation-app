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
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export function StoryContentStyles() {
  return (
    <style jsx global>{`
      /* Rich Text Editor Styles */
      .prose-editor .ProseMirror {
        outline: none;
        min-height: 300px;
        padding: 1rem;
      }

      /* Placeholder */
      .prose-editor .ProseMirror.ProseMirror-focused .placeholder {
        display: none;
      }

      /* Text Selection */
      .prose-editor .ProseMirror ::selection {
        background: rgba(59, 130, 246, 0.3);
      }

      .prose-editor .ProseMirror ::-moz-selection {
        background: rgba(59, 130, 246, 0.3);
      }

      /* Headings */
      .prose-editor .ProseMirror h1,
      .prose h1 {
        font-size: 2.25rem;
        font-weight: 700;
        line-height: 2.5rem;
        margin: 1.5rem 0 1rem 0;
        color: #111827;
      }

      .prose-editor .ProseMirror h2,
      .prose h2 {
        font-size: 1.875rem;
        font-weight: 600;
        line-height: 2.25rem;
        margin: 1.25rem 0 0.75rem 0;
        color: #111827;
      }

      .prose-editor .ProseMirror h3,
      .prose h3 {
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 2rem;
        margin: 1rem 0 0.5rem 0;
        color: #111827;
      }

      /* Paragraphs */
      .prose-editor .ProseMirror p,
      .prose p {
        margin: 0.75rem 0;
        line-height: 1.7;
        color: #374151;
      }

      .prose-editor .ProseMirror p:first-child,
      .prose p:first-child {
        margin-top: 0;
      }

      .prose-editor .ProseMirror p:last-child,
      .prose p:last-child {
        margin-bottom: 0;
      }

      /* Text Formatting */
      .prose-editor .ProseMirror strong,
      .prose strong {
        font-weight: 600;
        color: #111827;
      }

      .prose-editor .ProseMirror em,
      .prose em {
        font-style: italic;
      }

      .prose-editor .ProseMirror u,
      .prose u {
        text-decoration: underline;
      }

      .prose-editor .ProseMirror s,
      .prose s {
        text-decoration: line-through;
      }

      .prose-editor .ProseMirror code,
      .prose code {
        background: #f3f4f6;
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-family: "JetBrains Mono", "Fira Code", "Source Code Pro", Consolas,
          "Liberation Mono", Menlo, Courier, monospace;
        font-size: 0.875em;
        color: #dc2626;
      }

      .prose-editor .ProseMirror mark,
      .prose mark {
        background-color: #fef08a;
        border-radius: 0.125rem;
        padding: 0.125rem 0.25rem;
      }

      /* Lists */
      .prose-editor .ProseMirror ul,
      .prose ul {
        margin: 1rem 0;
        padding-left: 1.5rem;
        list-style-type: disc;
      }

      .prose-editor .ProseMirror ol,
      .prose ol {
        margin: 1rem 0;
        padding-left: 1.5rem;
        list-style-type: decimal;
      }

      .prose-editor .ProseMirror li,
      .prose li {
        margin: 0.25rem 0;
        line-height: 1.7;
      }

      .prose-editor .ProseMirror ul li,
      .prose ul li {
        list-style-type: disc;
      }

      .prose-editor .ProseMirror ol li,
      .prose ol li {
        list-style-type: decimal;
      }

      /* Nested Lists */
      .prose-editor .ProseMirror ul ul,
      .prose ul ul {
        margin: 0.25rem 0;
        list-style-type: circle;
      }

      .prose-editor .ProseMirror ul ul ul,
      .prose ul ul ul {
        list-style-type: square;
      }

      .prose-editor .ProseMirror ol ol,
      .prose ol ol {
        margin: 0.25rem 0;
        list-style-type: lower-alpha;
      }

      .prose-editor .ProseMirror ol ol ol,
      .prose ol ol ol {
        list-style-type: lower-roman;
      }

      /* Blockquotes */
      .prose-editor .ProseMirror blockquote,
      .prose blockquote {
        margin: 1.5rem 0;
        padding-left: 1rem;
        border-left: 4px solid #e5e7eb;
        font-style: italic;
        color: #6b7280;
      }

      .prose-editor .ProseMirror blockquote p,
      .prose blockquote p {
        margin: 0.5rem 0;
      }

      /* Code Blocks */
      .prose-editor .ProseMirror pre,
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

      .prose-editor .ProseMirror pre code,
      .prose pre code {
        background: none;
        padding: 0;
        border-radius: 0;
        color: #111827;
        font-size: 0.875rem;
      }

      /* Links */
      .prose-editor .ProseMirror a,
      .prose a {
        color: #2563eb;
        text-decoration: underline;
        cursor: pointer;
      }

      .prose-editor .ProseMirror a:hover,
      .prose a:hover {
        color: #1d4ed8;
        text-decoration: underline;
      }

      /* Text Alignment */
      .prose-editor .ProseMirror [style*="text-align: center"],
      .prose [style*="text-align: center"] {
        text-align: center;
      }

      .prose-editor .ProseMirror [style*="text-align: right"],
      .prose [style*="text-align: right"] {
        text-align: right;
      }

      .prose-editor .ProseMirror [style*="text-align: left"],
      .prose [style*="text-align: left"] {
        text-align: left;
      }

      /* Focus States */
      .prose-editor .ProseMirror:focus {
        outline: none;
      }

      /* Selection in headings */
      .prose-editor .ProseMirror h1::selection,
      .prose-editor .ProseMirror h2::selection,
      .prose-editor .ProseMirror h3::selection {
        background: rgba(59, 130, 246, 0.3);
      }

      /* Ensure proper cursor behavior */
      .prose-editor .ProseMirror {
        cursor: text;
      }

      .prose-editor .ProseMirror * {
        cursor: inherit;
      }

      /* Fix for line-clamp utility classes */
      .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .line-clamp-3 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }

      /* Card content prose styles */
      .prose-sm h1 {
        font-size: 1.25rem;
        margin: 0.5rem 0;
      }
      .prose-sm h2 {
        font-size: 1.125rem;
        margin: 0.5rem 0;
      }
      .prose-sm h3 {
        font-size: 1rem;
        margin: 0.5rem 0;
      }
      .prose-sm p {
        margin: 0.25rem 0;
        font-size: 0.875rem;
      }
      .prose-sm ul,
      .prose-sm ol {
        margin: 0.25rem 0;
        font-size: 0.875rem;
      }
      .prose-sm li {
        margin: 0.125rem 0;
      }
      .prose-sm blockquote {
        margin: 0.5rem 0;
        font-size: 0.875rem;
      }
    `}</style>
  );
}
