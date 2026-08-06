import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import RichText from './RichText.jsx';
import { streamChat } from '../utils/chatClient.js';

/*
 * Study assistant — a docked panel that answers questions about whatever the
 * learner is currently reading.
 *
 * Like the rest of the app, the conversation lives in memory only and resets on
 * refresh. See the persistence note in App.jsx.
 *
 * The reply streams in, so the visible assistant message is built up in state
 * one delta at a time. `activeRequest` holds the AbortController for the call in
 * flight, which is what makes Stop (and closing the panel) actually cancel it.
 */

const GREETING =
  'Hi — ask me anything about the course material, and I can explain concepts, ' +
  'compare options, or quiz you on a topic.';

const SUGGESTIONS = [
  'Explain this topic in simple terms',
  'Give me three exam-style questions',
  'What is most likely to be tested here?',
];

/* Free-tier models queue, and the configured one reasons before it answers, so
   a first token can be minutes away. Silence that long reads as a broken panel,
   so the wait narrates itself. Thresholds are seconds since the send. */
const WAIT_NOTES = [
  { after: 90, text: 'Still queued. Free-tier models can take a few minutes to start.' },
  { after: 20, text: 'Waiting for the model to respond…' },
];

function waitNote(seconds, isReasoning) {
  if (isReasoning) return 'Thinking it through…';
  return WAIT_NOTES.find((note) => seconds >= note.after)?.text ?? null;
}

export default function Chatbot({ context }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isReasoning, setIsReasoning] = useState(false);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [error, setError] = useState(null);

  const activeRequest = useRef(null);
  const transcriptRef = useRef(null);
  const inputRef = useRef(null);

  /* Follow the reply as it grows, and land on the newest turn when one is
     added. */
  useEffect(() => {
    const node = transcriptRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, streamingText, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  /* Never leave a request running behind a closed panel or an unmounted tree. */
  useEffect(() => () => activeRequest.current?.abort(), []);

  /* Drives the "still waiting" copy. Only ticks while nothing has arrived yet. */
  useEffect(() => {
    if (!isStreaming) return undefined;
    const started = Date.now();
    const timer = setInterval(
      () => setWaitSeconds(Math.round((Date.now() - started) / 1000)),
      1000
    );
    return () => clearInterval(timer);
  }, [isStreaming]);

  const stop = useCallback(() => {
    activeRequest.current?.abort();
    activeRequest.current = null;
  }, []);

  const close = useCallback(() => {
    stop();
    setIsOpen(false);
  }, [stop]);

  useEffect(() => {
    if (!isOpen) return undefined;

    function onKeyDown(event) {
      if (event.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  const send = useCallback(
    async (text) => {
      const question = text.trim();
      if (question === '' || isStreaming) return;

      const history = [...messages, { role: 'user', content: question }];
      setMessages(history);
      setDraft('');
      setError(null);
      setStreamingText('');
      setIsReasoning(false);
      setWaitSeconds(0);
      setIsStreaming(true);

      const controller = new AbortController();
      activeRequest.current = controller;

      /* Deltas arrive faster than React needs to paint; appending to a local
         string and setting state from it keeps the growing reply in one place. */
      let reply = '';

      try {
        await streamChat({
          messages: history,
          context,
          signal: controller.signal,
          onReasoning: () => setIsReasoning(true),
          onDelta: (delta) => {
            reply += delta;
            setStreamingText(reply);
          },
        });

        if (reply.trim() !== '') {
          setMessages([...history, { role: 'assistant', content: reply }]);
        } else {
          setError('The assistant returned an empty reply. Try asking again.');
        }
      } catch (streamError) {
        /* A cancelled request is a deliberate act, not a failure — but keep
           whatever had already streamed in so the partial answer is not lost. */
        if (controller.signal.aborted) {
          if (reply.trim() !== '') {
            setMessages([...history, { role: 'assistant', content: reply }]);
          }
        } else {
          setError(streamError.message);
        }
      } finally {
        activeRequest.current = null;
        setIsStreaming(false);
        setIsReasoning(false);
        setStreamingText('');
      }
    },
    [context, isStreaming, messages]
  );

  function onSubmit(event) {
    event.preventDefault();
    send(draft);
  }

  /* Enter sends, Shift+Enter starts a new line — the convention for this kind
     of composer. */
  function onKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send(draft);
    }
  }

  function clearConversation() {
    stop();
    setMessages([]);
    setStreamingText('');
    setError(null);
    setIsStreaming(false);
    setIsReasoning(false);
    inputRef.current?.focus();
  }

  const isEmpty = messages.length === 0;

  return (
    <>
      <button
        type="button"
        className="chat-fab"
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        aria-expanded={isOpen}
        aria-controls="study-assistant"
      >
        <Icon name={isOpen ? 'x' : 'lightbulb'} />
        <span>{isOpen ? 'Close' : 'Ask the assistant'}</span>
      </button>

      {isOpen ? (
        <section
          className="chat-panel"
          id="study-assistant"
          aria-label="Study assistant"
        >
          <header className="chat-panel__head">
            <div className="chat-panel__title">
              <Icon name="lightbulb" className="chat-panel__title-icon" />
              <div>
                <h2>Study assistant</h2>
                <p>Answers reset when you refresh.</p>
              </div>
            </div>

            <div className="chat-panel__head-actions">
              {!isEmpty ? (
                <button
                  type="button"
                  className="chat-icon-btn"
                  onClick={clearConversation}
                  title="Clear conversation"
                >
                  <Icon name="refresh" title="Clear conversation" />
                </button>
              ) : null}
              <button
                type="button"
                className="chat-icon-btn"
                onClick={close}
                title="Close assistant"
              >
                <Icon name="x" title="Close assistant" />
              </button>
            </div>
          </header>

          <div className="chat-transcript" ref={transcriptRef} tabIndex={-1}>
            {isEmpty && !isStreaming ? (
              <div className="chat-intro">
                <p className="chat-msg chat-msg--assistant">{GREETING}</p>
                <ul className="chat-suggestions">
                  {SUGGESTIONS.map((suggestion) => (
                    <li key={suggestion}>
                      <button
                        type="button"
                        className="chat-suggestion"
                        onClick={() => send(suggestion)}
                      >
                        {suggestion}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={`chat-msg chat-msg--${message.role}`}
              >
                <RichText text={message.content} />
              </p>
            ))}

            {isStreaming ? (
              <div className="chat-pending" aria-live="polite">
                <p className="chat-msg chat-msg--assistant">
                  {streamingText === '' ? (
                    <span className="chat-typing" aria-label="Thinking">
                      <span />
                      <span />
                      <span />
                    </span>
                  ) : (
                    <RichText text={streamingText} />
                  )}
                </p>

                {streamingText === '' && waitNote(waitSeconds, isReasoning) ? (
                  <p className="chat-wait-note">{waitNote(waitSeconds, isReasoning)}</p>
                ) : null}
              </div>
            ) : null}

            {error ? (
              <p className="chat-error" role="alert">
                <Icon name="alert" />
                <span>{error}</span>
              </p>
            ) : null}
          </div>

          <form className="chat-composer" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="chat-input">
              Ask the study assistant a question
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              className="chat-composer__input"
              rows={2}
              placeholder="Ask about this course…"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onKeyDown}
            />
            {isStreaming ? (
              <button type="button" className="btn btn--danger chat-send" onClick={stop}>
                Stop
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn--primary chat-send"
                disabled={draft.trim() === ''}
              >
                <Icon name="arrowRight" title="Send" />
              </button>
            )}
          </form>
        </section>
      ) : null}
    </>
  );
}
