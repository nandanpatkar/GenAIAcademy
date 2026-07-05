import { afterEach, describe, expect, it } from 'vitest';
import { sanitizeAISettings } from './aiSettings';
import { clearPersistedAISettings, loadPersistedAISettings, persistAISettings } from './aiSettingsPersistence';
import { DEFAULT_AI_SETTINGS } from './defaults';

describe('aiSettings', () => {
  afterEach(() => {
    localStorage.removeItem('flow-design-ai-settings');
    localStorage.removeItem('flow-design-ai-settings-secret');
    sessionStorage.removeItem('flow-design-ai-settings');
    sessionStorage.removeItem('flow-design-ai-settings-secret');
  });

  it('falls back to defaults for invalid provider values', () => {
    const sanitized = sanitizeAISettings(
      {
        provider: 'not-a-provider' as never,
        apiKey: '  secret  ',
        model: '  gemini-2.5-pro  ',
        customBaseUrl: '  https://example.com  ',
      },
      DEFAULT_AI_SETTINGS
    );

    expect(sanitized.provider).toBe(DEFAULT_AI_SETTINGS.provider);
    expect(sanitized.storageMode).toBe(DEFAULT_AI_SETTINGS.storageMode);
    expect(sanitized.apiKey).toBe('secret');
    expect(sanitized.model).toBe('gemini-2.5-pro');
    expect(sanitized.customBaseUrl).toBe('https://example.com');
  });

  it('keeps only valid custom headers', () => {
    const sanitized = sanitizeAISettings(
      {
        provider: 'custom',
        storageMode: 'session',
        customHeaders: [
          { key: ' Authorization ', value: 'Bearer token', enabled: true },
          { key: '', value: 'skip-me' },
          { key: 'X-Empty', value: 10 as never },
        ],
      },
      DEFAULT_AI_SETTINGS
    );

    expect(sanitized.customHeaders).toEqual([
      { key: 'Authorization', value: 'Bearer token', enabled: true },
    ]);
    expect(sanitized.storageMode).toBe('session');
  });

  it('persists and reloads sanitized AI settings from local storage by default', () => {
    persistAISettings({
      provider: 'custom',
      storageMode: 'local',
      apiKey: '  secret  ',
      model: '  model-1  ',
      customBaseUrl: '  https://example.com  ',
      customHeaders: [{ key: ' Authorization ', value: 'Bearer token', enabled: true }],
    });

    expect(localStorage.getItem('flow-design-ai-settings')).not.toContain('secret');
    expect(localStorage.getItem('flow-design-ai-settings-secret')).toBeTruthy();

    expect(loadPersistedAISettings()).toEqual({
      provider: 'custom',
      storageMode: 'local',
      apiKey: 'secret',
      model: 'model-1',
      customBaseUrl: 'https://example.com',
      customHeaders: [{ key: 'Authorization', value: 'Bearer token', enabled: true }],
    });
  });

  it('persists session-only AI settings in sessionStorage and clears local copy', () => {
    localStorage.setItem('flow-design-ai-settings', JSON.stringify({
      provider: 'gemini',
      storageMode: 'local',
      apiKey: 'local-secret',
    }));

    persistAISettings({
      provider: 'openai',
      storageMode: 'session',
      apiKey: ' session-secret ',
      model: ' gpt-4o ',
      customBaseUrl: undefined,
      customHeaders: [],
    });

    expect(localStorage.getItem('flow-design-ai-settings')).toBeNull();
    expect(JSON.parse(sessionStorage.getItem('flow-design-ai-settings') ?? '{}')).toMatchObject({
      provider: 'openai',
      storageMode: 'session',
      model: 'gpt-4o',
    });
    expect(sessionStorage.getItem('flow-design-ai-settings')).not.toContain('session-secret');
    expect(sessionStorage.getItem('flow-design-ai-settings-secret')).toBeTruthy();
    expect(loadPersistedAISettings().storageMode).toBe('session');
  });

  it('reloads legacy plaintext api keys for compatibility while rewriting newer writes to secret storage', () => {
    localStorage.setItem('flow-design-ai-settings', JSON.stringify({
      provider: 'gemini',
      storageMode: 'local',
      apiKey: 'legacy-secret',
      model: 'gemini-2.5-pro',
    }));

    expect(loadPersistedAISettings()).toEqual({
      provider: 'gemini',
      storageMode: 'local',
      apiKey: 'legacy-secret',
      model: 'gemini-2.5-pro',
      customBaseUrl: undefined,
      customHeaders: [],
    });

    persistAISettings(loadPersistedAISettings());

    expect(localStorage.getItem('flow-design-ai-settings')).not.toContain('legacy-secret');
    expect(localStorage.getItem('flow-design-ai-settings-secret')).toBeTruthy();
  });

  it('ignores malformed persisted AI settings payloads', () => {
    localStorage.setItem('flow-design-ai-settings', JSON.stringify({
      provider: 'invalid-provider',
      storageMode: 'local',
      model: 42,
    }));

    expect(loadPersistedAISettings()).toEqual(DEFAULT_AI_SETTINGS);
  });

  it('can clear persisted AI settings from both storage buckets', () => {
    localStorage.setItem('flow-design-ai-settings', JSON.stringify({
      provider: 'gemini',
      storageMode: 'local',
      apiKey: 'local-secret',
    }));
    sessionStorage.setItem('flow-design-ai-settings', JSON.stringify({
      provider: 'openai',
      storageMode: 'session',
      apiKey: 'session-secret',
    }));

    clearPersistedAISettings();

    expect(localStorage.getItem('flow-design-ai-settings')).toBeNull();
    expect(sessionStorage.getItem('flow-design-ai-settings')).toBeNull();
    expect(loadPersistedAISettings()).toEqual(DEFAULT_AI_SETTINGS);
  });
});
