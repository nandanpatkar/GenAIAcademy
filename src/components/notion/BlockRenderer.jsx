import React from 'react';
import Heading from './renderers/Heading';
import Paragraph from './renderers/Paragraph';
import CodeBlock from './renderers/CodeBlock';
import ListBlock from './renderers/ListBlock';
import Callout from './renderers/Callout';
import ColumnList from './renderers/ColumnList';
import Column from './renderers/Column';
import ChildPage from './renderers/ChildPage';
import ImageBlock from './renderers/ImageBlock';
import GenericLinkBlock from './renderers/GenericLinkBlock';
import BookmarkBlock from './renderers/BookmarkBlock';
import QuoteBlock from './renderers/QuoteBlock';
import TodoBlock from './renderers/TodoBlock';
import ToggleBlock from './renderers/ToggleBlock';
import TableBlock from './renderers/TableBlock';
import VideoBlock from './renderers/VideoBlock';
import ChildDatabase from './renderers/ChildDatabase';

const Divider = () => <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1em 0' }} />;

const renderers = {
  heading_1: Heading,
  heading_2: Heading,
  heading_3: Heading,
  paragraph: Paragraph,
  code: CodeBlock,
  bulleted_list_item: ListBlock,
  numbered_list_item: ListBlock,
  callout: Callout,
  column_list: ColumnList,
  column: Column,
  child_page: ChildPage,
  image: ImageBlock,
  file: GenericLinkBlock,
  pdf: GenericLinkBlock,
  link_preview: BookmarkBlock,
  bookmark: BookmarkBlock,
  divider: Divider,
  quote: QuoteBlock,
  to_do: TodoBlock,
  toggle: ToggleBlock,
  table: TableBlock,
  table_row: TableBlock,
  video: VideoBlock,
  child_database: ChildDatabase,
};

export default function BlockRenderer({ block, onNavigateToPage }) {
  if (!block) return null;

  const Component = renderers[block.type];

  if (!Component) {
    console.warn(`Unsupported Notion block type: ${block.type}`);
    return (
      <div style={{ color: 'var(--text3)', fontSize: '0.8rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: '0.5rem' }}>
        Unsupported block: {block.type}
      </div>
    );
  }

  return <Component block={block} onNavigateToPage={onNavigateToPage} />;
}
