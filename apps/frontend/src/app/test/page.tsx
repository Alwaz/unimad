'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000/api/v1';

interface TestResult {
  id: string;
  name: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  response?: unknown;
  error?: string;
  durationMs?: number;
}

async function apiCall(path: string, options?: RequestInit) {
  const start = performance.now();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const duration = Math.round(performance.now() - start);
  const body = res.status === 204 ? null : await res.json();
  return { status: res.status, body, duration, ok: res.ok };
}

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [programSlug, setProgramSlug] = useState('');
  const [degree, setDegree] = useState('');
  const [mode, setMode] = useState('');
  const resultsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [results]);

  const updateResult = useCallback((id: string, update: Partial<TestResult>) => {
    setResults((prev) => prev.map((r) => (r.id === id ? { ...r, ...update } : r)));
  }, []);

  const addResult = useCallback((name: string): string => {
    const id = crypto.randomUUID();
    setResults((prev) => [...prev, { id, name, status: 'loading' }]);
    return id;
  }, []);

  const runTest = useCallback(
    async (
      name: string,
      fn: () => Promise<{ status: number; body: unknown; duration: number; ok: boolean }>,
    ) => {
      const id = addResult(name);
      try {
        const result = await fn();
        updateResult(id, {
          status: result.ok ? 'success' : 'error',
          response: result.body,
          durationMs: result.duration,
          error: result.ok ? undefined : `HTTP ${result.status}`,
        });
        return result;
      } catch (err) {
        updateResult(id, {
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error',
        });
        return null;
      }
    },
    [addResult, updateResult],
  );

  const testHealth = () => runTest('GET /health', () => apiCall('/health'));
  const testServerInfo = () => runTest('GET /test/info', () => apiCall('/test/info'));
  const testEcho = () =>
    runTest('POST /test/echo', () =>
      apiCall('/test/echo', {
        method: 'POST',
        body: JSON.stringify({ message: 'Hello!', ts: Date.now() }),
      }),
    );
  const testDelay = () => runTest('GET /test/delay/500', () => apiCall('/test/delay/500'));
  const testSimulatedError = () => runTest('GET /test/error/422', () => apiCall('/test/error/422'));

  const testListPrograms = () => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    if (query.trim()) params.set('query', query.trim());
    if (programSlug.trim()) params.set('programs', programSlug.trim());
    if (degree) params.set('degree', degree);
    if (mode) params.set('mode', mode);
    const qs = params.toString();
    return runTest(`GET /programs?${qs}`, () => apiCall(`/programs?${qs}`));
  };

  const runAllTests = async () => {
    setResults([]);
    await testHealth();
    await testServerInfo();
    await testEcho();
    await testDelay();
    await testSimulatedError();
    await testListPrograms();
  };

  const successCount = results.filter((r) => r.status === 'success').length;
  const errorCount = results.filter((r) => r.status === 'error').length;

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* LEFT — Controls */}
      <div
        style={{
          width: '380px',
          minWidth: '380px',
          borderRight: '1px solid #2a2a2a',
          overflowY: 'auto',
          padding: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
          API Test Dashboard
        </h1>
        <p
          style={{
            color: '#666',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            marginBottom: '1.5rem',
          }}
        >
          {API_URL}
        </p>

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={runAllTests} style={btn('#3b82f6')}>
            Run All
          </button>
          <button onClick={() => setResults([])} style={btn('#6b7280')}>
            Clear
          </button>
        </div>

        <Section title="Health & Info">
          <button onClick={testHealth} style={btn('#10b981')}>
            Health
          </button>
          <button onClick={testServerInfo} style={btn('#10b981')}>
            Info
          </button>
        </Section>

        <Section title="Test Routes">
          <button onClick={testEcho} style={btn('#8b5cf6')}>
            Echo
          </button>
          <button onClick={testDelay} style={btn('#8b5cf6')}>
            Delay
          </button>
          <button onClick={testSimulatedError} style={btn('#ef4444')}>
            Error 422
          </button>
        </Section>

        <Section title="Programs">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              width: '100%',
              marginBottom: '0.5rem',
            }}
          >
            <input
              placeholder="Search query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={input}
            />
            <input
              placeholder="Program slug (e.g. software-engineering)"
              value={programSlug}
              onChange={(e) => setProgramSlug(e.target.value)}
              style={input}
            />
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              style={{ ...input, color: degree ? '#ccc' : '#666' }}
            >
              <option value="">Degree (all)</option>
              <option value="bachelor">Bachelor</option>
              <option value="master">Master</option>
              <option value="phd">PhD</option>
            </select>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              style={{ ...input, color: mode ? '#ccc' : '#666' }}
            >
              <option value="">Mode (all)</option>
              <option value="ON_CAMPUS">On Campus</option>
              <option value="ONLINE">Online</option>
              <option value="HYBRID">Hybrid</option>
            </select>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                placeholder="Page"
                min={1}
                value={page}
                onChange={(e) => setPage(Math.max(1, Number(e.target.value)))}
                style={{ ...input, flex: 1 }}
              />
              <input
                type="number"
                placeholder="Page size"
                min={1}
                max={100}
                value={pageSize}
                onChange={(e) => setPageSize(Math.max(1, Number(e.target.value)))}
                style={{ ...input, flex: 1 }}
              />
            </div>
          </div>
          <button onClick={testListPrograms} style={btn('#3b82f6')}>
            List
          </button>
          <button
            onClick={() => { setQuery(''); setProgramSlug(''); setDegree(''); setMode(''); setPage(1); setPageSize(10); }}
            style={btn('#6b7280')}
          >
            Reset
          </button>
        </Section>
      </div>

      {/* RIGHT — Results */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #2a2a2a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 600 }}>Results</span>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
            {results.length > 0 && (
              <>
                <span style={{ color: '#22c55e' }}>{successCount} passed</span>
                {errorCount > 0 && <span style={{ color: '#ef4444' }}>{errorCount} failed</span>}
                <span style={{ color: '#888' }}>{results.length} total</span>
              </>
            )}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {results.length === 0 ? (
            <p style={{ color: '#555', textAlign: 'center', marginTop: '4rem' }}>
              Run a test to see results here
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {results.map((r) => (
                <ResultCard key={r.id} result={r} />
              ))}
              <div ref={resultsEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <h2
        style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
          color: '#999',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </h2>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}

function ResultCard({ result }: { result: TestResult }) {
  const [expanded, setExpanded] = useState(false);
  const colors = { idle: '#6b7280', loading: '#f59e0b', success: '#22c55e', error: '#ef4444' };

  return (
    <div
      style={{
        border: `1px solid ${colors[result.status]}30`,
        borderRadius: '6px',
        padding: '0.6rem 0.75rem',
        background: `${colors[result.status]}08`,
        cursor: 'pointer',
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: colors[result.status],
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{result.name}</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '0.6rem',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: '#888',
            flexShrink: 0,
          }}
        >
          {result.durationMs !== undefined && <span>{result.durationMs}ms</span>}
          {result.error && <span style={{ color: '#ef4444' }}>{result.error}</span>}
          <span style={{ fontSize: '0.65rem' }}>{expanded ? '▼' : '▶'}</span>
        </div>
      </div>
      {expanded && result.response != null && (
        <pre
          style={{
            marginTop: '0.4rem',
            padding: '0.5rem',
            background: '#0a0a0a',
            borderRadius: '4px',
            fontSize: '0.7rem',
            overflow: 'auto',
            maxHeight: '250px',
            color: '#bbb',
          }}
        >
          {JSON.stringify(result.response, null, 2)}
        </pre>
      )}
    </div>
  );
}

const btn = (bg: string): React.CSSProperties => ({
  padding: '0.4rem 0.75rem',
  background: bg,
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  fontWeight: 500,
});
const input: React.CSSProperties = {
  padding: '0.4rem 0.6rem',
  background: '#141414',
  color: '#ccc',
  border: '1px solid #333',
  borderRadius: '5px',
  fontSize: '0.8rem',
};
