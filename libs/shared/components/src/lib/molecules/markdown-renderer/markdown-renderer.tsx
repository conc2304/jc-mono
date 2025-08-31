import React from 'react';
import { Typography, useTheme } from '@mui/material';
import ReactMarkdown from 'react-markdown';

interface MarkdownTypographyProps {
  content?: string | string[];
  isMarkdown?: boolean; // Optional: explicitly specify if content is markdown
}

export const MarkdownRenderer: React.FC<MarkdownTypographyProps> = ({
  content,
  isMarkdown = false,
}) => {
  const theme = useTheme();

  // Custom renderers for markdown elements using MUI Typography
  const markdownRenderers = {
    // Paragraphs
    p: ({ children }: any) => (
      <Typography
        variant="body1"
        sx={{
          mb: 2,
          lineHeight: 1.6,
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Typography>
    ),

    // Headings
    h1: ({ children }: any) => (
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          mt: 3,
          fontWeight: 'bold',
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Typography>
    ),

    h2: ({ children }: any) => (
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          mt: 2.5,
          fontWeight: 'bold',
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Typography>
    ),

    h3: ({ children }: any) => (
      <Typography
        variant="h6"
        sx={{
          mb: 1.5,
          mt: 2,
          fontWeight: 'bold',
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Typography>
    ),

    // Lists
    ul: ({ children }: any) => (
      <Typography
        component="ul"
        sx={{
          mb: 2,
          pl: 2,
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Typography>
    ),

    ol: ({ children }: any) => (
      <Typography
        component="ol"
        sx={{
          mb: 2,
          pl: 2,
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Typography>
    ),

    li: ({ children }: any) => (
      <Typography
        component="li"
        variant="body1"
        sx={{
          mb: 0.5,
          lineHeight: 1.6,
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Typography>
    ),

    // Emphasis
    strong: ({ children }: any) => (
      <Typography
        component="strong"
        sx={{
          fontWeight: 'bold',
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Typography>
    ),

    em: ({ children }: any) => (
      <Typography
        component="em"
        sx={{
          fontStyle: 'italic',
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Typography>
    ),

    // Code
    code: ({ children }: any) => (
      <Typography
        component="code"
        sx={{
          fontFamily: 'monospace',
          backgroundColor: theme.palette.grey[100],
          padding: '2px 4px',
          borderRadius: 1,
          fontSize: '0.875em',
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Typography>
    ),

    // Blockquotes
    blockquote: ({ children }: any) => (
      <Typography
        component="blockquote"
        sx={{
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          pl: 2,
          ml: 0,
          mb: 2,
          fontStyle: 'italic',
          color: theme.palette.text.secondary,
        }}
      >
        {children}
      </Typography>
    ),
  };

  // Simple heuristic to detect markdown (you can make this more sophisticated)
  const detectMarkdown = (text: string): boolean => {
    const markdownPatterns = [
      /^#{1,6}\s+/m, // Headers
      /\*\*.*?\*\*/, // Bold
      /\*.*?\*/, // Italic
      /^\s*[-*+]\s+/m, // Unordered lists
      /^\s*\d+\.\s+/m, // Ordered lists
      /```[\s\S]*?```/, // Code blocks
      /`.*?`/, // Inline code
      /^\s*>\s+/m, // Blockquotes
    ];

    return markdownPatterns.some((pattern) => pattern.test(text));
  };

  const renderContent = (content?: string | string[]): React.ReactNode => {
    if (Array.isArray(content)) {
      return content.map((paragraph, index) => {
        const shouldRenderAsMarkdown = isMarkdown || detectMarkdown(paragraph);

        if (shouldRenderAsMarkdown) {
          return (
            <ReactMarkdown key={index} components={markdownRenderers}>
              {paragraph}
            </ReactMarkdown>
          );
        }

        return (
          <Typography
            key={index}
            variant="body1"
            sx={{
              mb: 2,
              lineHeight: 1.6,
              color: theme.palette.text.primary,
            }}
          >
            {paragraph}
          </Typography>
        );
      });
    }

    if (typeof content === 'string') {
      const shouldRenderAsMarkdown = isMarkdown || detectMarkdown(content);

      if (shouldRenderAsMarkdown) {
        return (
          <ReactMarkdown components={markdownRenderers}>
            {content}
          </ReactMarkdown>
        );
      }
    }

    return (
      <Typography
        variant="body1"
        sx={{
          lineHeight: 1.6,
          color: theme.palette.text.primary,
        }}
      >
        {content}
      </Typography>
    );
  };

  return <>{renderContent(content)}</>;
};

export default MarkdownRenderer;
