import { useCallback, useEffect } from 'react';
import { useMessageHandler } from '../../shared/useMessageHandler';

const waitForElement = (selector: string, timeout = 10000): Promise<Element | null> =>
  new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);
    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        observer.disconnect();
        resolve(found);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => { observer.disconnect(); resolve(null); }, timeout);
  });

export const Zai = () => {
  const sendToChat = useCallback(
    async (content: { route: string; body: object }, prompt: string) => {
      const editor = await waitForElement('#chat-input') as HTMLTextAreaElement;

      if (!editor) {
        console.error('[ApiBeam z.ai] Could not find z.ai input textarea');
        return;
      }

      const text = `${prompt ? prompt + '\n' : ''}Route: ${content.route}\nPayload: ${JSON.stringify(content.body)}`;

      editor.focus();

      // Set value using native input setter to trigger React/Svelte change detection
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;
      if (nativeSetter) {
        nativeSetter.call(editor, text);
      } else {
        editor.value = text;
      }
      editor.dispatchEvent(new Event('input', { bubbles: true }));

      window.setTimeout(async () => {
        const sendBtn =
          (document.querySelector('#send-message-button') as HTMLButtonElement) ??
          (document.querySelector('button[type="submit"]') as HTMLButtonElement);
        if (sendBtn && !sendBtn.disabled) {
          sendBtn.click();
        } else {
          console.warn('[ApiBeam z.ai] Send button not found or disabled');
        }
      }, 200);
    },
    []
  );

  const runLastScript = (response: unknown) => {
    if (response !== null && response !== undefined) {
      chrome.runtime.sendMessage({ type: 'question_answer', content: response });
    }
  };

  useMessageHandler(sendToChat);

  useEffect(() => {
    const newScript = document.createElement('script');
    newScript.src = chrome.runtime.getURL('loader-zai.js');
    document.body.appendChild(newScript);
    newScript.onload = () => {
      window.addEventListener('message', (event) => {
        if (event.source !== window) return;
        const { data } = event.data || {};
        runLastScript(data);
      });
    };
  }, []);

  return <div />;
};
