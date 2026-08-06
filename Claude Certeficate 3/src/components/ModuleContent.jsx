import Icon from './Icon.jsx';
import RichText from './RichText.jsx';
import InlineReviewQuestion from './InlineReviewQuestion.jsx';

/*
 * Renders one module: header, every section's content blocks, then the
 * module's own review questions as expandable Q&A.
 *
 * The block vocabulary is documented in src/data/courses.js.
 */

const CALLOUT_ICON = {
  key: 'lightbulb',
  note: 'info',
  warning: 'alert',
  disclaimer: 'shield',
};

function Block({ block }) {
  switch (block.type) {
    case 'p':
      return (
        <p className={`blk-p${block.variant === 'lede' ? ' blk-p--lede' : ''}`}>
          <RichText text={block.text} />
        </p>
      );

    case 'h': {
      const Tag = block.level === 4 ? 'h4' : 'h3';
      return <Tag className={block.level === 4 ? 'blk-h4' : 'blk-h3'}>{block.text}</Tag>;
    }

    case 'ul':
      return (
        <ul className="blk-list">
          {block.items.map((item, i) => (
            <li key={i} className="blk-li">
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );

    case 'ol':
      return (
        <ol className="blk-list">
          {block.items.map((item, i) => (
            <li key={i} className="blk-li">
              <RichText text={item} />
            </li>
          ))}
        </ol>
      );

    /* Code and configuration listings. Rendered verbatim in a scrollable,
       monospaced block — never parsed, never syntax-highlighted. */
    case 'code':
      return (
        <div
          className="blk-code"
          tabIndex={0}
          role="group"
          aria-label={block.language ? `${block.language} code sample` : 'Code sample'}
        >
          <pre className="blk-code__pre">
            <code>{block.text}</code>
          </pre>
        </div>
      );

    case 'table':
      return (
        <div className="blk-table-wrap" tabIndex={0} role="group" aria-label={block.caption ?? 'Table'}>
          <table className="blk-table">
            {block.caption ? <caption>{block.caption}</caption> : null}
            <thead>
              <tr>
                {block.headers.map((header, i) => (
                  <th key={i} scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) =>
                    cellIndex === 0 ? (
                      <th key={cellIndex} scope="row">
                        <RichText text={cell} />
                      </th>
                    ) : (
                      <td key={cellIndex}>
                        <RichText text={cell} />
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'callout':
      return (
        <aside className={`blk-callout blk-callout--${block.variant ?? 'key'}`}>
          <span className="blk-callout__icon">
            <Icon name={CALLOUT_ICON[block.variant] ?? 'lightbulb'} />
          </span>
          <div className="blk-callout__body">
            {block.title ? <p className="blk-callout__title">{block.title}</p> : null}
            {block.body.map((paragraph, i) => (
              <p key={i} className="blk-callout__text">
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
        </aside>
      );

    case 'cards':
      return (
        <div className="blk-cards">
          {block.items.map((item, i) => (
            <div key={i} className="blk-card">
              {item.eyebrow ? <p className="blk-card__eyebrow">{item.eyebrow}</p> : null}
              <p className="blk-card__title">{item.title}</p>
              <p className="blk-card__body">
                <RichText text={item.body} />
              </p>
            </div>
          ))}
        </div>
      );

    case 'steps':
      return (
        <ol className="blk-steps">
          {block.items.map((item, i) => (
            <li key={i} className="blk-step">
              <span className="blk-step__num" aria-hidden="true" />
              <div className="blk-step__body">
                <p className="blk-step__title">{item.title}</p>
                <p className="blk-step__text">
                  <RichText text={item.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );

    case 'quote':
      return (
        <figure className="blk-quote">
          {block.label ? (
            <figcaption className="blk-quote__label">{block.label}</figcaption>
          ) : null}
          <blockquote className="blk-quote__text">{block.text}</blockquote>
        </figure>
      );

    case 'compare':
      return (
        <div className="blk-compare">
          {block.items.map((item, i) => (
            <div
              key={i}
              className={`blk-compare__col${item.tone ? ` blk-compare__col--${item.tone}` : ''}`}
            >
              {item.label ? <p className="blk-compare__label">{item.label}</p> : null}
              <p className="blk-compare__title">{item.title}</p>
              <p className="blk-compare__text">
                <RichText text={item.body} />
              </p>
            </div>
          ))}
        </div>
      );

    case 'takeaways':
      return (
        <ol className="blk-takeaways">
          {block.items.map((item, i) => (
            <li key={i} className="blk-takeaway">
              <span className="blk-takeaway__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="blk-takeaway__title">{item.title}</p>
                <p className="blk-takeaway__text">
                  <RichText text={item.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );

    default:
      return null;
  }
}

export default function ModuleContent({
  module,
  moduleIndex,
  moduleCount,
  units,
  onPrev,
  onNext,
}) {
  const prevDisabled = moduleIndex === 0;
  const nextDisabled = moduleIndex === moduleCount - 1;

  return (
    <article className="reader">
      <header className="card reader__head">
        <p className="eyebrow">
          <Icon name="book" />
          {units.Cap} {module.number} of {moduleCount} · {module.duration}
        </p>
        <h1 className="reader__title">{module.title}</h1>
        {module.lede ? <p className="reader__lede">{module.lede}</p> : null}

        {module.objectives.length > 0 ? (
          <div className="reader__objectives">
            <p className="eyebrow">By the end of this module, you will be able to</p>
            <ol>
              {module.objectives.map((objective, i) => (
                <li key={i}>{objective}</li>
              ))}
            </ol>
          </div>
        ) : null}
      </header>

      {module.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="card reader__section"
          aria-labelledby={`${section.id}-heading`}
        >
          <div className="reader__section-head">
            {section.eyebrow ? (
              <p className="eyebrow">
                {section.eyebrow}
                {section.duration ? ` · ${section.duration}` : ''}
              </p>
            ) : null}
            <h2 className="reader__section-title" id={`${section.id}-heading`}>
              {section.title}
            </h2>
          </div>
          <div className="reader__blocks">
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </section>
      ))}

      {module.reviewQuestions.length > 0 ? (
        <section
          className="card reader__section"
          id={`${module.id}-review`}
          aria-labelledby={`${module.id}-review-heading`}
        >
          <div className="reader__section-head">
            <p className="eyebrow">
              <Icon name="quiz" />
              Review · not scored
            </p>
            <h2 className="reader__section-title" id={`${module.id}-review-heading`}>
              Check your knowledge
            </h2>
            <p className="blk-p">
              {module.reviewQuestions.length} questions from this {units.one}.{' '}
              {module.reviewQuestions.every((q) => (q.options?.length ?? 0) === 0)
                ? 'These are short answer: work each one out, then reveal the answer to compare.'
                : 'Expand a question, choose your answer, and the verdict and rationale appear.'}{' '}
              Nothing here is scored &mdash; for a scored attempt, use the Quiz.
            </p>
          </div>
          <div className="review">
            {module.reviewQuestions.map((question, i) => (
              <InlineReviewQuestion key={question.id} question={question} index={i} />
            ))}
          </div>
        </section>
      ) : null}

      <nav className="card pager" aria-label={`${units.Cap} navigation`}>
        <button
          type="button"
          className="btn btn--outline"
          onClick={onPrev}
          disabled={prevDisabled}
          aria-label={`Previous ${units.one}`}
        >
          <Icon name="arrowLeft" />
          <span className="pager__btn-label" aria-hidden="true">
            Previous {units.one}
          </span>
        </button>
        <span className="pager__count">
          {units.Cap} {module.number} of {moduleCount}
        </span>
        <button
          type="button"
          className="btn btn--primary"
          onClick={onNext}
          disabled={nextDisabled}
          aria-label={`Next ${units.one}`}
        >
          <span className="pager__btn-label" aria-hidden="true">
            Next {units.one}
          </span>
          <Icon name="arrowRight" />
        </button>
      </nav>
    </article>
  );
}
