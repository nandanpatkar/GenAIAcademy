import React from 'react';
import InlineLink from './renderers/InlineLink';

export const darkColorMap = {
  default: 'var(--notion-text-bright, #f4f7ff)',
  gray: '#d7deed',
  brown: '#f3b08c',
  orange: '#ffc267',
  yellow: '#ffe56e',
  green: '#6ff5bb',
  blue: '#82d9ff',
  purple: '#d29aff',
  pink: '#ff8bd1',
  red: '#ff9388',
  gray_background: 'rgba(148, 163, 184, 0.28)',
  brown_background: 'rgba(217, 119, 87, 0.34)',
  orange_background: 'rgba(245, 158, 11, 0.36)',
  yellow_background: 'rgba(250, 204, 21, 0.34)',
  green_background: 'rgba(16, 185, 129, 0.32)',
  blue_background: 'rgba(14, 165, 233, 0.34)',
  purple_background: 'rgba(139, 92, 246, 0.36)',
  pink_background: 'rgba(236, 72, 153, 0.34)',
  red_background: 'rgba(239, 68, 68, 0.34)',
};

export default function RichTextRenderer({ textArray }) {
  if (!textArray || !Array.isArray(textArray)) return null;

  return (
    <>
      {textArray.map((textItem, idx) => {
        const { annotations, plain_text, href } = textItem;
        
        let content = plain_text;
        
        // Wrap in formatting tags
        if (annotations) {
          if (annotations.bold) content = <strong key={`bold-${idx}`}>{content}</strong>;
          if (annotations.italic) content = <em key={`italic-${idx}`}>{content}</em>;
          if (annotations.strikethrough) content = <s key={`strike-${idx}`}>{content}</s>;
          if (annotations.underline) content = <u key={`under-${idx}`}>{content}</u>;
          if (annotations.code) {
            content = (
              <code
                key={`code-${idx}`}
                style={{
                  background: 'rgba(34, 211, 238, 0.18)',
                  border: '1px solid rgba(34, 211, 238, 0.26)',
                  padding: '2px 4px',
                  borderRadius: 4,
                  fontFamily: 'monospace',
                  fontSize: '0.9em',
                  color: '#9fffe0'
                }}
              >
                {content}
              </code>
            );
          }
        }

        if (href) {
          if (plain_text === href) {
            // Raw URL pasted, render it as a rich inline link mention
            content = <InlineLink key={`link-${idx}`} url={href} />;
          } else {
            // Manually hyperlinked text, keep original text
            content = (
              <a
                key={`link-${idx}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--notion-link-bright, #9fe8ff)', textDecoration: 'underline', textDecorationColor: 'rgba(130, 217, 255, 0.9)', textUnderlineOffset: '3px' }}
              >
                {content}
              </a>
            );
          }
        }

        // Apply Notion color/background
        if (annotations && annotations.color && annotations.color !== 'default') {
          const isBg = annotations.color.includes('_background');
          const colorValue = darkColorMap[annotations.color] || 'inherit';
          
          content = (
            <span key={`color-${idx}`} style={{ 
              color: isBg ? 'inherit' : colorValue,
              backgroundColor: isBg ? colorValue : 'transparent',
              padding: isBg ? '0 4px' : '0',
              borderRadius: isBg ? '3px' : '0'
            }}>
              {content}
            </span>
          );
        }

        // Add a span wrapper if it doesn't have an outer element from annotations
        if (typeof content === 'string') {
          content = <span key={`text-${idx}`}>{content}</span>;
        }

        return <React.Fragment key={idx}>{content}</React.Fragment>;
      })}
    </>
  );
}
