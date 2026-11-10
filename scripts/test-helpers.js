#!/usr/bin/env node
'use strict';
/**
 * Offline checks for the deterministic helpers around the model calls.
 * No network, no API keys.
 *
 *   npm test
 */
const assert = require('assert');
const { htmlToText, extractJsonObject, deadlinePassed, queryKey } = require('../src/monitor');

// Digest HTML becomes readable text: scripts and styles dropped, entities decoded
const text = htmlToText('<style>p{color:red}</style><p>Looking for a <b>coffee</b> expert &amp; roaster</p><script>x()</script><p>Deadline: Friday</p>');
assert.ok(text.includes('Looking for a coffee expert & roaster'));
assert.ok(text.includes('Deadline: Friday'));
assert.ok(!text.includes('color:red') && !text.includes('x()'));
assert.strictEqual(htmlToText(''), '');

// Model output is parsed even when wrapped in prose or code fences
assert.deepStrictEqual(extractJsonObject('Here you go:\n```json\n{"total_queries":2,"queries":[]}\n```'), { total_queries: 2, queries: [] });
assert.throws(() => extractJsonObject('no json here'));

// Deadlines: past ones are skipped (with a one-hour grace), unparseable ones are kept
assert.strictEqual(deadlinePassed(new Date(Date.now() - 3 * 3600 * 1000).toISOString()), true);
assert.strictEqual(deadlinePassed(new Date(Date.now() - 20 * 60 * 1000).toISOString()), false);
assert.strictEqual(deadlinePassed(new Date(Date.now() + 86400 * 1000).toISOString()), false);
assert.strictEqual(deadlinePassed('end of day Friday'), false);
assert.strictEqual(deadlinePassed(null), false);

// The cooldown key is stable across whitespace and case differences
assert.strictEqual(queryKey({ full_query_text: 'Seeking  Coffee\nExperts' }), queryKey({ full_query_text: 'seeking coffee experts' }));

console.log('ok: 12 helper checks passed');
