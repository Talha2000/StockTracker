import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('only updates once the value has been stable for the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'm' },
    });
    expect(result.current).toBe('m');

    rerender({ value: 'me' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    rerender({ value: 'met' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Each keystroke restarted the timer, so nothing has settled yet.
    expect(result.current).toBe('m');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('met');
  });
});
