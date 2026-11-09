import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { audit, references, validate } from '../scripts/catalogs.mjs';

test('compares English values rather than keys and preserves translated values', () => {
  const english = { symbolic_key: 'Open', Save: 'Save', Cancel: 'Cancel', Close: 'Close', Istio: 'Istio' };
  const result = audit(english, { symbolic_key: 'Open', Save: 'Guardar', Close: '  ', Istio: 'Istio' }, 'es');
  assert.deepEqual(result.candidates.map(({ key, reason }) => [key, reason]), [
    ['symbolic_key', 'matches_english'], ['Cancel', 'missing'], ['Close', 'blank'], ['Istio', 'matches_english']
  ]);
});

const englishPlural = { '{{count}} item_one': '{{count}} item', '{{count}} item_other': '{{count}} items' };

test('requires locale plural categories rather than copying English categories', () => {
  const chinese = references(englishPlural, 'zh');
  assert.deepEqual([...chinese.keys()], ['{{count}} item_other']);
  const spanish = references(englishPlural, 'es');
  assert.deepEqual(new Set(spanish.keys()), new Set(['{{count}} item_one', '{{count}} item_many', '{{count}} item_other']));
  assert.deepEqual(spanish.get('{{count}} item_many'), {
    sourceKey: '{{count}} item', pluralCategory: 'many',
    englishKey: '{{count}} item_other', english: '{{count}} items'
  });
});

test('supports explicit zero overrides and does not treat a lone _one key as a family', () => {
  const english = { ...englishPlural, '{{count}} item_zero': 'No items', step_one: 'First step' };
  const result = references(english, 'ko');
  assert.equal(result.get('{{count}} item_zero').english, 'No items');
  assert.equal(result.get('step_one').english, 'First step');
});

test('inspects existing surplus forms but does not require or delete them', () => {
  const target = { '{{count}} item_one': '{{count}} item', '{{count}} item_other': '{{count}} 个项目', Old: '原有' };
  const result = audit(englishPlural, target, 'zh');
  assert.deepEqual(result.candidates.map(entry => entry.key), ['{{count}} item_one']);
  assert.deepEqual(result.targetOnlyKeys, ['{{count}} item_one', 'Old']);
  assert.equal(validate(englishPlural, target, 'zh', target).valid, true);
});

test('allows filling gaps with reordered placeholders and complete rich-text elements', () => {
  const key = 'Run <1>{{name}}</1> with <4>{{args}}</4>';
  const english = { key: key, Save: 'Save' };
  const before = { key, Save: '' };
  const target = { key: '使用 <4>{{args}}</4> 运行 <1>{{name}}</1>', Save: '保存' };
  assert.equal(validate(english, target, 'zh', before).valid, true);
});

test('rejects changes to existing translations even when new wording seems valid', () => {
  const result = validate({ Save: 'Save' }, { Save: 'Almacenar' }, 'es', { Save: 'Guardar' });
  assert.equal(result.valid, false);
  assert.equal(result.errors[0].reason, 'changed_existing_translation');
});

test('rejects key deletion, new unknown keys, and blank new values', () => {
  const result = validate({ Save: 'Save', Open: 'Open' }, { Renamed: 'Guardar', Open: '' }, 'es', { Save: 'Save' });
  assert.deepEqual(new Set(result.errors.map(error => error.reason)),
    new Set(['removed_existing_key', 'unexpected_key', 'blank_changed_value']));
});

test('rejects placeholder loss, renaming, formatting changes, and duplication', () => {
  const english = { key: 'Value {{value, number}} for {{name}}' };
  for (const value of ['值 {{value, number}}', '值 {{value, number}} {{nombre}}',
    '值 {{value}} {{name}}', '值 {{value, number}} {{name}} {{name}}']) {
    const result = validate(english, { key: value }, 'zh', {});
    assert.equal(result.valid, false, value);
    assert.equal(result.errors[0].reason, 'changed_interpolation_or_rich_text');
  }
});

test('rejects broken rich-text nesting and changed marker identities', () => {
  const english = { key: '<1><2>Open</2></1>' };
  for (const value of ['<1><2>打开</1></2>', '<1>打开</1>', '<1><3>打开</3></1>']) {
    assert.equal(validate(english, { key: value }, 'zh', {}).valid, false, value);
  }
});

test('supports self-closing and named tags while preserving attributes', () => {
  const english = { key: 'See <Link to="/help">help</Link><br/><0/>' };
  assert.equal(validate(english, { key: '查看 <Link to="/help">帮助</Link><br/><0/>' }, 'zh', {}).valid, true);
  assert.equal(validate(english, { key: '查看 <Link to="/other">帮助</Link><br/><0/>' }, 'zh', {}).valid, false);
});

test('preserves literal Find syntax such as <label> without requiring HTML closing tags', () => {
  const english = { key: '<label> is a k8s label on the service, workload, etc' };
  assert.equal(validate(english, { key: '<label> 是服务、工作负载等上的 k8s 标签' }, 'zh', {}).valid, true);
  assert.equal(validate(english, { key: '<标签> 是 k8s 标签' }, 'zh', {}).valid, false);
  const mixed = { key: 'Use <label> with <1>help</1>' };
  assert.equal(validate(mixed, { key: '使用 <label> 和 <1>帮助</1>' }, 'zh', {}).valid, true);
  assert.equal(validate(mixed, { key: '使用 <label> 和 <1>帮助' }, 'zh', {}).valid, false);
});

test('does not reinterpret unchanged translations or unrelated legacy entries', () => {
  const before = { Save: 'Guardar {{old}}', Legacy: '<1>Sin cierre' };
  assert.equal(validate({ Save: 'Save' }, { ...before, Open: 'Abrir' }, 'es', before).valid, false);
  assert.equal(validate({ Save: 'Save', Open: 'Open' }, { ...before, Open: 'Abrir' }, 'es', before).valid, true);
});

test('rejects English targets and unsupported locales', () => {
  for (const locale of ['en', 'en-US', 'zz', 'not_a_locale']) {
    assert.throws(() => references({ Save: 'Save' }, locale));
  }
  assert.throws(() => references({}, 'es'), /English catalog is empty/);
});

test('CLI is read-only and distinguishes findings, validation failures, and input errors', () => {
  const directory = mkdtempSync(join(tmpdir(), 'kiali-translate-'));
  const script = new URL('../scripts/catalogs.mjs', import.meta.url);
  try {
    const paths = Object.fromEntries(['english', 'target', 'before'].map(name => [name, join(directory, `${name}.json`)]));
    writeFileSync(paths.english, JSON.stringify({ Save: 'Save' }));
    writeFileSync(paths.target, JSON.stringify({ Save: 'Save' }));
    writeFileSync(paths.before, JSON.stringify({ Save: 'Guardar' }));
    const originals = Object.fromEntries(Object.values(paths).map(path => [path, readFileSync(path, 'utf8')]));
    const flags = ['--english', paths.english, '--target', paths.target, '--locale', 'es'];
    const run = args => {
      const env = { ...process.env };
      delete env.NODE_TEST_CONTEXT;
      const result = spawnSync(process.execPath, [fileURLToPath(script), ...args], { encoding: 'utf8', env });
      assert.ifError(result.error);
      return result;
    };
    const audited = run(['audit', ...flags]);
    assert.equal(audited.status, 0, JSON.stringify(audited));
    assert.ok(audited.stdout, JSON.stringify(audited));
    assert.equal(JSON.parse(audited.stdout).candidateCount, 1);
    assert.equal(run(['validate', ...flags, '--before', paths.before]).status, 1);
    assert.equal(run(['validate', ...flags]).status, 2);
    assert.equal(run(['audit', ...flags, '--locale', 'zh']).status, 2);
    for (const [path, content] of Object.entries(originals)) assert.equal(readFileSync(path, 'utf8'), content);
    writeFileSync(paths.target, '{broken');
    assert.equal(run(['audit', ...flags]).status, 2);
    writeFileSync(paths.target, JSON.stringify({ Save: null }));
    assert.equal(run(['audit', ...flags]).status, 2);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('CLI audits catalogs when the skill is installed through a symlink', () => {
  const directory = mkdtempSync(join(tmpdir(), 'kiali-translate-link-'));
  try {
    const english = join(directory, 'english.json');
    const target = join(directory, 'target.json');
    const script = join(directory, 'catalogs.mjs');
    writeFileSync(english, JSON.stringify({ Save: 'Save' }));
    writeFileSync(target, JSON.stringify({ Save: 'Save' }));
    symlinkSync(fileURLToPath(new URL('../scripts/catalogs.mjs', import.meta.url)), script);
    const env = { ...process.env };
    delete env.NODE_TEST_CONTEXT;
    const result = spawnSync(process.execPath, [script, 'audit', '--english', english, '--target', target, '--locale', 'es'], {
      encoding: 'utf8', env
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).candidates[0].key, 'Save');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('reports source base keys without stripping suffixes from literal identifiers', () => {
  const english = { ...englishPlural, step_one: 'First step', symbolic_key: 'Open' };
  const result = audit(english, { '{{count}} item_one': '{{count}} item' }, 'fr');
  const many = result.candidates.find(entry => entry.key === '{{count}} item_many');
  assert.equal(many.sourceKey, '{{count}} item');
  assert.equal(many.pluralCategory, 'many');
  assert.equal(many.englishKey, '{{count}} item_other');
  assert.equal(result.candidates.find(entry => entry.key === 'step_one').sourceKey, 'step_one');
  assert.equal(result.candidates.find(entry => entry.key === 'symbolic_key').sourceKey, 'symbolic_key');
  const surplus = audit(englishPlural, { '{{count}} item_one': '{{count}} item' }, 'zh');
  assert.equal(surplus.candidates.find(entry => entry.key.endsWith('_one')).sourceKey, '{{count}} item');
});

test('validates French categories even when English uses the same singular default for every form', () => {
  const english = { '{{count}} version_one': '{{count}} version', '{{count}} version_other': '{{count}} version' };
  const french = { '{{count}} version_one': '{{count}} version', '{{count}} version_other': '{{count}} versions' };
  assert.equal(audit(english, french, 'fr').candidates.find(entry => entry.reason === 'missing').key,
    '{{count}} version_many');
  french['{{count}} version_many'] = '{{count}} versions';
  assert.equal(validate(english, french, 'fr', {}).valid, true);
  const categories = new Set(Object.keys(french).map(key => key.split('_').at(-1)));
  for (const count of [0, 1, 2, 1000000]) assert.ok(categories.has(new Intl.PluralRules('fr').select(count)));
});

test('preserves URLs across reordering and localized punctuation, rejecting changes and duplication', () => {
  const english = { key: 'See https://example.org/help?lang=en and https://example.org/api.' };
  assert.equal(validate(english,
    { key: '参考 https://example.org/api，以及 https://example.org/help?lang=en。' }, 'zh', {}).valid, true);
  for (const value of ['Voir https://example.org/help?lang=fr et https://example.org/api.',
    'Voir https://example.org/help?lang=en et https://example.org/api/other.',
    'Voir https://example.org/help?lang=en.',
    'Voir https://example.org/help?lang=en https://example.org/api https://example.org/api']) {
    assert.ok(validate(english, { key: value }, 'fr', {}).errors.some(error => error.reason === 'changed_url'));
  }
});

test('reports boundary whitespace for composition review without rejecting locale-specific spacing', () => {
  const english = { key: ' in cluster {{cluster}} ' };
  const intact = validate(english, { key: ' dans le cluster {{cluster}} ' }, 'fr', {});
  assert.deepEqual(intact.warnings, []);
  const changed = validate(english, { key: '在集群 {{cluster}}' }, 'zh', {});
  assert.equal(changed.valid, true);
  assert.deepEqual(changed.warnings, [{ key: 'key', reason: 'changed_boundary_whitespace' }]);
});

test('checks explicitly protected identifiers, units and paths only in changed entries', () => {
  const english = { key: 'Set meshConfig.mode to ALLOW_ANY at 2 RPS; see /etc/istio/config' };
  const protectedTokens = { key: ['meshConfig.mode', 'ALLOW_ANY', 'RPS', '/etc/istio/config'] };
  const french = 'Définir meshConfig.mode sur ALLOW_ANY à 2 RPS ; voir /etc/istio/config';
  assert.equal(validate(english, { key: french }, 'fr', {}, protectedTokens).valid, true);
  for (const value of [french.replace('meshConfig.mode', 'meshConfig.autre'), french.replace('meshConfig.mode', 'meshConfigXmode'),
    french.replace('RPS', 'rps'),
    french.replace('/etc/istio/config', '/etc/other/config'), french + ' ALLOW_ANY',
    french.replace('ALLOW_ANY', 'ALLOW_ANY_OTHER'), french.replace('RPS', 'RPS2'),
    french.replace('meshConfig.mode', 'meshConfig.mode.extra'),
    french.replace('/etc/istio/config', '/etc/istio/config.backup')]) {
    const result = validate(english, { key: value }, 'fr', {}, protectedTokens);
    assert.ok(result.errors.some(error => error.reason === 'changed_protected_token'), value);
  }
  assert.equal(validate(english, { key: french }, 'fr', { key: french },
    { key: ['old_token'] }).valid, true);
  assert.ok(validate(english, { key: french }, 'fr', {}, { key: ['wrong_token'] }).errors
    .some(error => error.reason === 'protected_token_not_in_english'));
});

test('imports from standard input without trying to run the CLI or resolving a file named dash', () => {
  const script = new URL('../scripts/catalogs.mjs', import.meta.url).href;
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ['--input-type=module', '-'], {
    input: `import { audit } from ${JSON.stringify(script)};\nconsole.log(audit({ Save: 'Save' }, {}, 'es').candidateCount);`,
    encoding: 'utf8', env
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), '1');
});

test('CLI applies optional token maps and rejects malformed maps or audit-only misuse', () => {
  const directory = mkdtempSync(join(tmpdir(), 'kiali-translate-tokens-'));
  try {
    const english = join(directory, 'english.json');
    const target = join(directory, 'target.json');
    const before = join(directory, 'before.json');
    const tokenMap = join(directory, 'tokens.json');
    writeFileSync(english, JSON.stringify({ key: 'Set mode to ALLOW_ANY' }));
    writeFileSync(target, JSON.stringify({ key: 'Définir le mode sur AUTRE' }));
    writeFileSync(before, '{}');
    writeFileSync(tokenMap, JSON.stringify({ key: ['ALLOW_ANY'] }));
    const originals = [english, target, before, tokenMap].map(path => readFileSync(path, 'utf8'));
    const env = { ...process.env };
    delete env.NODE_TEST_CONTEXT;
    const run = (mode, flags = []) => spawnSync(process.execPath, [
      fileURLToPath(new URL('../scripts/catalogs.mjs', import.meta.url)), mode,
      '--english', english, '--target', target, '--locale', 'fr', ...flags
    ], { encoding: 'utf8', env });
    const result = run('validate', ['--before', before, '--tokens', tokenMap]);
    assert.equal(result.status, 1, result.stderr);
    assert.equal(JSON.parse(result.stdout).errors[0].reason, 'changed_protected_token');
    assert.equal(run('audit', ['--tokens', tokenMap]).status, 2);
    assert.deepEqual([english, target, before, tokenMap].map(path => readFileSync(path, 'utf8')), originals);
    for (const value of [null, [], { key: 'ALLOW_ANY' }, { key: [null] }, { key: [''] }]) {
      writeFileSync(tokenMap, JSON.stringify(value));
      assert.equal(run('validate', ['--before', before, '--tokens', tokenMap]).status, 2);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('allows URL quotation changes while preserving balanced URL parentheses and IPv6 brackets', () => {
  const english = { key: "Read (https://example.org/help), 'https://[::1]:8443/api' and https://example.org/Function_(math)." };
  const french = 'Voir « https://[::1]:8443/api », https://example.org/Function_(math) et https://example.org/help.';
  assert.equal(validate(english, { key: french }, 'fr', {}).valid, true);
  assert.equal(validate(english, { key: french.replace('_(math)', '_(math') }, 'fr', {}).valid, false);
});

test('does not use inherited object properties as token protection lists', () => {
  assert.equal(validate({ toString: 'String value' }, { toString: 'Valeur de chaîne' }, 'fr', {}).valid, true);
});
