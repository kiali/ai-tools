#!/usr/bin/env node
// Read-only catalog inspection. All translation decisions belong to the skill.
import { readFileSync, realpathSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const pluralSuffix = /^(.*)_(zero|one|two|few|many|other)$/;
const owns = (object, key) => Object.hasOwn(object, key);
const blank = value => value.trim().length === 0;

export function readCatalog(path) {
  const catalog = JSON.parse(readFileSync(path, 'utf8'));
  if (!catalog || Array.isArray(catalog) || typeof catalog !== 'object' ||
      Object.values(catalog).some(value => typeof value !== 'string')) {
    throw new Error(`${path}: expected a flat JSON object with string values`);
  }
  return catalog;
}

export function references(english, locale) {
  if (Object.keys(english).length === 0) throw new Error('English catalog is empty; verify generation and source coverage');
  const canonical = Intl.getCanonicalLocales(locale)[0];
  if (!canonical || !Intl.PluralRules.supportedLocalesOf([canonical]).length) {
    throw new Error(`Unsupported locale: ${locale}`);
  }
  if (canonical.split('-')[0] === 'en') throw new Error('Select a non-English target locale');
  const categories = new Intl.PluralRules(canonical).resolvedOptions().pluralCategories;
  const result = new Map();
  const families = new Map();
  for (const [key, value] of Object.entries(english)) {
    const match = key.match(pluralSuffix);
    // A suffix alone is not proof of pluralization: require an _other sibling.
    if (match && owns(english, `${match[1]}_other`)) {
      if (!families.has(match[1])) families.set(match[1], new Set());
      families.get(match[1]).add(match[2]);
    } else {
      result.set(key, { sourceKey: key, englishKey: key, english: value });
    }
  }
  for (const [base, sourceCategories] of families) {
    const required = new Set(categories);
    if (sourceCategories.has('zero')) required.add('zero');
    for (const category of required) {
      const key = `${base}_${category}`;
      const englishKey = owns(english, key) ? key : `${base}_other`;
      result.set(key, { sourceKey: base, pluralCategory: category, englishKey, english: english[englishKey] });
    }
  }
  return result;
}

// Resolve existing surplus forms too, without requiring or removing them.
function referenceFor(key, english, expected) {
  if (expected.has(key)) return expected.get(key);
  const match = key.match(pluralSuffix);
  const fallback = match && `${match[1]}_other`;
  if (fallback && owns(english, fallback)) {
    const englishKey = owns(english, key) ? key : fallback;
    return { sourceKey: match[1], pluralCategory: match[2], englishKey, english: english[englishKey] };
  }
  if (owns(english, key)) return { sourceKey: key, englishKey: key, english: english[key] };
  return undefined;
}

export function audit(english, target, locale) {
  const expected = references(english, locale);
  const inspected = new Map(expected);
  for (const key of Object.keys(target)) {
    const reference = referenceFor(key, english, expected);
    if (!inspected.has(key) && reference) inspected.set(key, reference);
  }
  const candidates = [];
  for (const [key, reference] of inspected) {
    const reason = !owns(target, key) ? 'missing' : blank(target[key]) ? 'blank' :
      target[key] === reference.english ? 'matches_english' : null;
    if (reason) candidates.push({ key, ...reference, reason, current: target[key] ?? null });
  }
  return {
    locale,
    expectedEntries: expected.size,
    inspectedEntries: inspected.size,
    candidateCount: candidates.length,
    candidates,
    targetOnlyKeys: Object.keys(target).filter(key => !expected.has(key)),
    note: 'Candidates require interpretation; matching English can be correct. Preserve target-only keys.'
  };
}

function tokens(text, literalNames) {
  const interpolation = text.match(/\{\{[\s\S]*?\}\}/g) ?? [];
  const remainder = text.replace(/\{\{[\s\S]*?\}\}/g, '');
  if (remainder.includes('{{') || remainder.includes('}}')) {
    throw new Error('malformed interpolation');
  }
  // Indexed React markers and named/HTML elements; '< 5' is not markup.
  const tags = remainder.match(/<\/?(?:\d+|[A-Za-z][\w.-]*)(?:\s+[^<>]*?)?\s*\/?>/g) ?? [];
  const stack = [];
  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  for (const tag of tags) {
    const name = tag.match(/^<\/?([^\s/>]+)/)[1];
    if (literalNames.has(name)) continue;
    if (tag.startsWith('</')) {
      if (stack.pop() !== name) throw new Error('unbalanced rich-text markers');
    } else if (!tag.endsWith('/>') && !voidTags.has(name)) {
      stack.push(name);
    }
  }
  if (stack.length) throw new Error('unbalanced rich-text markers');
  return { interpolation: interpolation.sort(), tags: tags.sort() };
}

function literalAngleNames(source) {
  // Find help uses literal syntax placeholders such as <label> and <op>.
  // Preserve those tokens, but do not require closing HTML tags for them.
  return new Set([...source.matchAll(/<([A-Za-z][\w.-]*)>/g)]
    .map(match => match[1])
    .filter(name => !source.includes(`</${name}>`)));
}

export function readTokenMap(path) {
  const map = JSON.parse(readFileSync(path, 'utf8'));
  if (!map || Array.isArray(map) || typeof map !== 'object' ||
      Object.values(map).some(value => !Array.isArray(value) ||
        value.some(token => typeof token !== 'string' || blank(token)))) {
    throw new Error(`${path}: expected an object mapping catalog keys to arrays of nonblank literal tokens`);
  }
  return map;
}

function urls(text) {
  // ASCII URLs in prose; protect non-ASCII URLs explicitly with a token map.
  return (text.match(/https?:\/\/[A-Za-z0-9\-._~:/?#[\]@!$&()*+,;=%]+/g) ?? [])
    .map(url => {
      url = url.replace(/[.,;:!?]+$/, '');
      for (const [open, close] of [['(', ')'], ['[', ']']]) {
        while (url.endsWith(close) && occurrences(url, close) > occurrences(url, open)) url = url.slice(0, -1);
      }
      return url;
    }).sort();
}

const boundaryWhitespace = text => [text.match(/^\s*/)[0], text.match(/\s*$/)[0]];
const occurrences = (text, fragment) => text.split(fragment).length - 1;

function literalOccurrences(text, fragment) {
  const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const start = /^[A-Za-z0-9_]/.test(fragment) ? '(?<![A-Za-z0-9_])' : '';
  const end = /[A-Za-z0-9_]$/.test(fragment) ? '(?![A-Za-z0-9_]|[./-][A-Za-z0-9_])' : '';
  return (text.match(new RegExp(`${start}${escaped}${end}`, 'g')) ?? []).length;
}

export function validate(english, target, locale, before, protectedTokens = {}) {
  const expected = references(english, locale);
  const errors = [];
  const changedKeys = [];
  const warnings = [];
  for (const [key, value] of Object.entries(before)) {
    if (!owns(target, key)) {
      errors.push({ key, reason: 'removed_existing_key' });
    } else if (target[key] !== value) {
      const reference = referenceFor(key, english, expected);
      if (!blank(value) && (!reference || value !== reference.english)) {
        errors.push({ key, reason: 'changed_existing_translation' });
      }
    }
  }
  for (const [key, value] of Object.entries(target)) {
    if (owns(before, key) && before[key] === value) continue;
    changedKeys.push(key);
    const reference = referenceFor(key, english, expected);
    if (!reference || (!owns(before, key) && !expected.has(key))) {
      errors.push({ key, reason: 'unexpected_key' });
      continue;
    }
    if (blank(value)) errors.push({ key, reason: 'blank_changed_value' });
    if (JSON.stringify(urls(reference.english)) !== JSON.stringify(urls(value))) {
      errors.push({ key, reason: 'changed_url' });
    }
    if (JSON.stringify(boundaryWhitespace(reference.english)) !== JSON.stringify(boundaryWhitespace(value))) {
      warnings.push({ key, reason: 'changed_boundary_whitespace' });
    }
    for (const token of new Set(owns(protectedTokens, key) ? protectedTokens[key] : [])) {
      const count = literalOccurrences(reference.english, token);
      if (!count) {
        errors.push({ key, reason: 'protected_token_not_in_english', token });
      } else if (count !== literalOccurrences(value, token)) {
        errors.push({ key, reason: 'changed_protected_token', token });
      }
    }
    try {
      const literalNames = literalAngleNames(reference.english);
      const source = tokens(reference.english, literalNames);
      const translated = tokens(value, literalNames);
      if (JSON.stringify(source) !== JSON.stringify(translated)) {
        errors.push({ key, reason: 'changed_interpolation_or_rich_text' });
      }
    } catch (error) {
      errors.push({ key, reason: error.message });
    }
  }
  return { locale, valid: errors.length === 0, changedKeys, errors, warnings };
}

function main(args) {
  if (args.length === 1 && args[0] === '--help') {
    console.log('node catalogs.mjs <audit|validate> --english en.json --target locale.json --locale es [--before saved-locale.json] [--tokens tokens.json]\nRead-only; JSON output. Exit 0: completed/passed; 1: validation failed; 2: input error.');
    return;
  }
  const [mode, ...flags] = args;
  if (!['audit', 'validate'].includes(mode)) throw new Error('Mode must be audit or validate; use --help');
  const options = {};
  for (let index = 0; index < flags.length; index += 2) {
    const key = flags[index];
    if (!['--english', '--target', '--locale', '--before', '--tokens'].includes(key) ||
        !flags[index + 1] || flags[index + 1].startsWith('--') || owns(options, key)) {
      throw new Error(`Invalid or duplicate option: ${key}`);
    }
    options[key] = flags[index + 1];
  }
  for (const key of ['--english', '--target', '--locale', ...(mode === 'validate' ? ['--before'] : [])]) {
    if (!options[key]) throw new Error(`Required option: ${key}`);
  }
  if (mode === 'audit' && (options['--before'] || options['--tokens'])) {
    throw new Error('--before and --tokens are only used by validate');
  }
  const english = readCatalog(options['--english']);
  const target = readCatalog(options['--target']);
  const report = mode === 'audit' ? audit(english, target, options['--locale']) :
    validate(english, target, options['--locale'], readCatalog(options['--before']),
      options['--tokens'] ? readTokenMap(options['--tokens']) : {});
  console.log(JSON.stringify(report, null, 2));
  if (report.valid === false) process.exitCode = 1;
}

if (process.argv[1] && process.argv[1] !== '-' && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
