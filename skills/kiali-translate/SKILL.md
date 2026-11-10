---
name: kiali-translate
description: Audit and complete existing Kiali UI localization catalogs. Use for translation coverage checks, gap filling, and explicitly requested translation corrections; not for adding languages.
---

# Kiali Translation Maintenance

## Scope and modes

- **Audit:** inspect and report translation gaps or explicitly requested quality issues without editing the Kiali checkout.
- **Translate:** fill confirmed gaps or apply explicitly authorized corrections in the requested locales; report unresolved items.

An audit can include proposed translations when requested; suggestions stay in
the report and do not change the locale files. Keep uncertain recommendations
separate from confirmed gaps, including intentionally unchanged recommendations.

Infer the mode from the request: checking or reporting means audit; completing or
filling translations means translate. If no mode is clear, use audit. Unless the
user specifies locales, start with Spanish (`es`). Honor any requested batch or UI
area; clearly label partial coverage. An explicit request for an audit of all
locales still covers all configured non-English locales.

Treat existing translations as correct by default. Do not review, rephrase,
normalize, or replace nonempty values that differ from English unless the user
explicitly requests that scope. Terminology differing from current guidance does
not authorize a rewrite. For authorized corrections, record an exact key/value
plan and the UI evidence for each correction; preserve all other values. Use
conventions for the gaps being filled and report conflicts that prevent a decision.

## Complete Spanish first

For a general or multi-language completion effort, first examine the Spanish
catalog against current English and fill its confirmed gaps. The team's Spanish
expertise can resolve uncertain wording and terminology through the reviewer
questions. Keep those items visible until resolved; do not call Spanish complete
merely because a translation has been proposed or structural checks pass.

Once Spanish is complete and its outstanding terminology decisions are resolved,
assume it is correct and use it as a trusted reference alongside English when
completing the remaining languages. Do not repeatedly re-review completed Spanish
or modify it as a side effect of translating another locale. Respect an explicit
request to work on a particular language rather than expanding it to Spanish.

English remains the source for detecting gaps and defining the message. Use
completed Spanish as needed to clarify intent, UI terminology, and the treatment
of technical terms; translate naturally into the target language rather than
mechanically translating Spanish. Preserve each target locale's existing correct
translations and its own grammar and plural rules. If English and Spanish appear
to disagree, check UI context and report any unresolved conflict.

Check that a Spanish reference entry still corresponds to the current English
message. Later English additions or meaning changes need Spanish completion too;
do not extend the trusted-reference assumption to new, untranslated, or stale
Spanish entries. Intentionally unchanged English terms can be correct Spanish,
so completion does not require eliminating every English match.

## Establish the reference

Use the user's existing `kiali/kiali` checkout; create a separate clone or worktree
only when explicitly requested. Preserve local changes, and explain any checkout
conflict rather than stashing, discarding work, or creating another checkout.
Read its applicable instructions,
`I18N-AGENTS.md` if present, the internationalization section of
`frontend/README.adoc`, and `frontend/i18next-parser.config.ts`. Discover supported
locales from that checkout rather than hardcoding a language list.

Catalogs normally live at `frontend/public/locales/<locale>/translation.json`.
The generated English catalog is the source of truth. **Compare values with the
English file, not with the JSON keys.** Keys are often English UI text, but may
have plural suffixes or an explicit default value. Completed Spanish supplies a
trusted second reference for interpretation. Other languages can provide
supporting evidence; none replaces the current English source message. Prefer
references relevant to the target language and UI domain. A reference locale's
choices to retain ordinary terms in English are not global glossary rules;
apply those choices only to that locale unless shared conventions say otherwise.

The English file is normally generated locally and gitignored. Verify it matches
the intended source revision and configuration, including relevant uncommitted
source changes. If absent or stale, generate it with the checkout's `i18n` package
script in a disposable frontend copy for either mode: the generator can rewrite
every locale. Carry the same source and parser configuration, including relevant
uncommitted changes, without creating another repository checkout. This keeps
reference generation from changing the user's catalogs before they are saved or
audited. If generation is unavailable, report that limitation; do not silently
invent an English catalog from keys or claim complete coverage.

## Find and interpret candidates

Run the bundled, read-only helper with Node.js (no additional packages). Resolve
`<skill-dir>` to this installed skill's directory, not the Kiali working directory:

```bash
node <skill-dir>/scripts/catalogs.mjs audit --english <en.json> --target <locale.json> --locale es
```

If a configured locale has no catalog yet, pass a temporary file containing `{}`
as the audit target; do not create a catalog in the checkout during audit.

The JSON output lists absent entries, blank values, and values identical to the
English reference. These are **candidates**, not confirmed untranslated strings.
The helper derives expected plural categories using `Intl.PluralRules` for the
target locale; English-only categories are not automatically required everywhere.
For a target category absent from English (such as Spanish `_many`), it uses the
English family's `_other` value and identifies that reference in the output.
An English `_zero` override is also retained. Confirm plural conventions against
the checkout's installed i18next/parser versions if they differ from this model.
Existing target-only keys are informational and must not be deleted.
Existing surplus plural forms are also inspected when an English reference can
be resolved, without making those forms mandatory for that locale. Distinguish
runtime-selected forms from retained surplus variants in gap counts and reports.
Verify which suffix the installed runtime selects before changing a plural
candidate; do not fill an inactive variant merely to eliminate an English match.

Candidates include `sourceKey` (the base key used in `t()`) and, for plural
families, `pluralCategory`. For example, `{{count}} App involved_one` comes from
`t('{{count}} App involved', { count: ... })`; `_one` is generated, not part of
the source call. Group variants under that base key and its actual source link in
reports, showing each proposed form and counting entries separately from messages.
Do not strip suffixes from unrelated literal keys such as `step_one` or
`step_other`. The helper recognizes a family only when English contains `_other`
and another category for the same base; confirm ambiguous cases at the source call.

Check that a candidate comes from production UI text. The parser may also scan
tests or extract an identifier instead of a message. Report confirmed test-only
entries and extraction artifacts separately, exclude them from confirmed gap
counts, and leave their catalog entries intact. If extraction loses the intended
message, describe that coverage limitation rather than treating the catalog as a
complete inventory of the UI.

Classify candidates using the checkout's glossary and actual source call sites:

- **Needs translation:** English prose or a missing/blank UI translation.
- **Intentionally unchanged:** a product name, literal API kind, identifier,
  technical token, or a word correctly shared with English in that locale.
- **Uncertain:** context or terminology is insufficient to choose confidently.

Keep intentionally unchanged values intact. A phrase containing a protected term
can still need translation around that term. In particular, distinguish a literal
API kind such as `DestinationRule` from a human-readable label such as
`Destination Rule`. Inspect the component, surrounding copy, translation options,
and interpolation values to resolve ambiguity. Follow any special conventions
such as preserving Find operands after the translated `Abbreviate:` label.

The detector does not prove completeness of UI instrumentation, detect every
partially translated value, or assess translation quality. Those are outside this
skill's default gap-completion scope; review them only when explicitly requested.

## Suggest translations during an audit

When requested, include an English/key and proposed target-language value for
each confirmed gap in a report table, with a source link and any contextual review
notes. State the catalog location once, rather than repeating it in every row.
Label the suggestions as drafts. Put genuinely unresolved terminology in the
reviewer-question table; record supported working choices as notes rather than
unanswered questions. Lack of a native reviewer alone does not make a supported
translation uncertain. A key/value JSON map can make suggestions easier to apply
later.

Use the same translation principles as translate mode. Check composed sentences
for grammatical dependencies, such as a fixed article surrounding an interpolated
resource kind. When prose names an option or label, use its current target-language
caption; distinguish localized UI wording from literal identifiers and expressions.
Report relevant conflicts without rewriting existing translations.

Validate suggestions in temporary copies against the original catalog using the
helper below. Check technical identifiers, expressions, and meaningful whitespace
in the actual suggestions as well. Do not write proposed values into the checkout
or count them as completed translations. Structural checks do not establish
linguistic correctness or rendered UI fit.

## Fill confirmed gaps

In translate mode, record the working state and save an exact copy of each
selected target catalog outside the repository **before editing or generating
catalogs in the checkout**.
Keep those copies as the baseline for validation, including user changes already
present. A missing target file is an empty baseline object; only create it for an
already-configured locale. Do not add a new language as part of filling gaps.

Use the checkout's explicit translation conventions, established usage in the
same locale, UI context, and target-language knowledge. When working beyond
Spanish, consult completed Spanish alongside English as needed for meaning and
terminology. Other locales can supply additional context. Do not mechanically
translate via another language or assume its grammar applies to the target.

Translate only confirmed gaps and explicitly authorized corrections. Keep keys,
interpolation expressions (including formatters), rich-text markers, URLs, code,
resource identifiers, units, and other protected tokens intact. Preserve meaningful
spaces in composed fragments.
Use the target language's plural forms and concise, natural UI wording.

Leave uncertain values unchanged, including missing entries, and record the
question for review. Do not insert speculative translations, annotations, or
review markers into catalog values. Preserve correct English words even though
they continue to appear as candidates on later runs.

## Validate and finish

Follow the checkout's formatting/generation conventions. If the parser must run
after edits to produce canonical ordering, snapshot every catalog it can touch
first; keep pre-existing work and undo only this run's out-of-scope changes from
those snapshots. Do not use a broad reset or discard user changes. Do not commit
the generated English catalog, remove existing entries, or change UI source as
part of this workflow. If generation removes baseline keys, retain those entries
and report the generation conflict rather than including their deletion.

Validate each selected catalog against its saved baseline and the same English
reference used for detection:

```bash
node <skill-dir>/scripts/catalogs.mjs validate --english <en.json> --target <locale.json> --locale es --before <saved-locale.json>
```

The helper rejects removed keys, edits to existing translations, unexpected new
keys, blank new values, and changed interpolation or rich-text tokens. It checks
new/changed values only, so old structural issues do not trigger a rewrite of
existing translations. Reordering whole rich-text elements is allowed when tokens
and nesting are preserved. It does not validate meaning, unlisted technical
tokens, layout, or grammatical correctness; inspect these in the actual diff.
Verify parser-created entries, selected locales, and unrelated user changes too.
Run the checkout's relevant formatting checks and report what actually ran.

Validation permits partial updates: `valid: true` does not establish completeness.
Rerun the audit after edits and account for remaining candidates within the
requested scope before claiming completion.

Authorized corrections still produce `changed_existing_translation` errors. Keep
the original baseline and the helper's strict policy. Independently verify that
changed keys and values match the correction plan plus confirmed gap fills, with
all other values and existing keys preserved. Report the authorized exceptions;
any other validation error remains a failure. The helper still checks corrected
values for structural and token errors.

For changed values, the helper also checks inline ASCII URLs and reports
`changed_boundary_whitespace` warnings. Review those warnings in the composed UI
sentence: preserve spacing needed for concatenation; a language-specific spacing
change can be valid. Warnings do not make `valid` false. Unchanged legacy entries
remain outside validation.

For literal identifiers, units, paths, or URLs needing explicit protection, pass
`--tokens <tokens.json>` to `validate`. The JSON object maps exact catalog keys
(including plural suffixes) to arrays of literal fragments, for example
`{"key": ["meshConfig.outboundTrafficPolicy.mode", "ALLOW_ANY", "RPS"]}`.
Choose fragments from the English value and the checkout's conventions; include
code delimiters when needed to distinguish a field name from ordinary prose.
The helper requires each fragment's exact spelling and occurrence count. Do not
protect human-readable captions that should be translated, or copy a language's
glossary into the helper. Checks apply only to new/changed entries.

Exercise changed plural families with the checkout's installed i18next and
representative counts (0, 1, 2, plus a count for other locale categories when
applicable; French 1,000,000 exercises `_many`). Verify natural singular/plural
wording even when a word is shared with English, such as `version` / `versions`.
Also check complete sentences with representative interpolation values and any
help text quoting changed captions. Inspect the caller's full composition,
including count prefixes such as `1 / `, adjacent icons, optional fragments, and
appended timestamps. When the caller supplies the number outside `t()`, a count
fragment may need a classifier or other grammatical material that a standalone
heading does not. Check each call site before reusing a translation.
Placeholder preservation alone cannot establish word order
or meaning: a label followed by `Since` and a timestamp may describe the start of
aggregated data rather than when calculation finished. Use temporary checks and
preserve translations outside the authorized scope; do not add dependencies or
UI tests just to exercise catalog data.

Summarize locale and scope, confirmed gaps, translations applied, intentionally
unchanged terms, unresolved items, and validation results. Distinguish candidates
from confirmed gaps and describe any source-generation or coverage limitations.
State whether Spanish is complete or still has unresolved gaps; when it was used
for another language, identify the Spanish revision or working snapshot consulted
and any reference entries that were unavailable or out of date.

When there are unresolved items, include a concise **PR comment draft** as a
Markdown table: locale, exact key, English reference, relevant UI context with a
source link, and a short reviewer question explaining the uncertainty. State the
catalog path pattern once above the table instead of repeating the translation
filename in every row. Combine the key and English reference columns when their
values are identical, and move shared explanations above the table. Include
a tentative suggestion only if useful, labeled as unverified. If none remain,
say so. Drafting this text does not authorize posting it: only create a PR or
publish a comment when the user requests that action. Do not add PR labels unless
the user explicitly requests them in the current task.
