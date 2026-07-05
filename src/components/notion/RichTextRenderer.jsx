import React from 'react';
import InlineLink from './renderers/InlineLink';

export const darkColorMap = {
  default: 'inherit',
  gray: 'rgba(255, 255, 255, 0.65)',
  brown: '#937264',
  orange: '#ffa344',
  yellow: '#ffdc49',
  green: '#4dab9a',
  blue: '#529cca',
  purple: '#9a6dd7',
  pink: '#e255a1',
  red: '#ff7369',
  gray_background: 'rgba(255, 255, 255, 0.05)',
  brown_background: 'rgba(147, 114, 100, 0.2)',
  orange_background: 'rgba(255, 163, 68, 0.2)',
  yellow_background: 'rgba(255, 220, 73, 0.2)',
  green_background: 'rgba(77, 171, 154, 0.2)',
  blue_background: 'rgba(82, 156, 202, 0.2)',
  purple_background: 'rgba(154, 109, 215, 0.2)',
  pink_background: 'rgba(226, 85, 161, 0.2)',
  red_background: 'rgba(255, 115, 105, 0.2)',
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
                  background: 'rgba(255,255,255,0.1)',
                  padding: '2px 4px',
                  borderRadius: 4,
                  fontFamily: 'monospace',
                  fontSize: '0.9em',
                  color: 'var(--neon)'
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
                style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.4)', textUnderlineOffset: '3px' }}
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
