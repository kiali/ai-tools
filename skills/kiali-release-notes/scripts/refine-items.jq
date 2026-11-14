# Refine closed issues into prefixed, sorted release-note bullets.

def label_names:
  [(.labels.nodes // [])[]?.name // empty];

def is_fix:
  label_names | index("bug") != null;

def strip_scaffold:
  gsub("^\\[(AI|CI)\\]\\s*"; "")
  | gsub("^\\((AI|CI|molecule|fleet-mesh)\\)\\s*"; "");

def display_title:
  .title
  | gsub("\\["; "(")
  | gsub("\\]"; ")")
  | strip_scaffold;

def repo_slug:
  if .url // "" | test("github\\.com/[^/]+/([^/]+)/") then
    (.url | capture("github\\.com/[^/]+/(?<r>[^/]+)/").r)
  else
    ""
  end;

def pick_prefix:
  . as $i
  | (repo_slug) as $repo
  | (display_title) as $t
  | ($t | ascii_downcase) as $tl
  | if $repo == "openshift-servicemesh-plugin" then "OSSMC"
    elif $repo == "kiali-operator" then "Operator"
    elif ($i.title | test("^\\[AI\\]|^\\(AI\\)", "i")) then "AI"
    elif ($i.title | test("^\\(CI\\)|^\\(molecule\\)", "i")) then "CI"
    elif ($i.title | test("^\\(fleet-mesh\\)", "i")) then "OSSMC"
    elif $tl | test("waypoint|ambient|ztunnel") then "Ambient"
    elif $tl | test("kia[0-9]|validation|validator|false positive") then "Validation"
    elif $tl | test("prometheus|federat|metrics|perses") then "Metrics"
    elif $tl | test("tempo|tracing|jaeger") then "Tempo"
    elif $tl | test("openapi|swagger") then "API"
    elif $tl | test("openid|auth|login|rbac") then "Auth"
    elif $tl | test("molecule|jenkins|workflow|github action") then "CI"
    elif $tl | test("operator|csv|olm") then "Operator"
    elif $tl | test("meshconfig|istio config|serviceentry") then "Istio"
    elif $tl | test("patternfly|modal|slider|flexview|theme|contrast|localization|i18n|translation") then "UX"
    elif $tl | test("graph|mesh page|ribbon|wizard|context menu|target panel|zoom") then "UI"
    elif $tl | test("mcp|chatbot|chat ") then "AI"
    elif $tl | test("config\\.get|server\\.port|feature flag") then "Config"
    elif $tl | test("namespace access|prometheus quer") then "Config"
    else "UI"
    end;

def bullet:
  . as $i
  | (pick_prefix) as $pfx
  | (display_title) as $t
  | {
      key: ($pfx + ": " + $t) | ascii_downcase,
      url: $i.url,
      line: "* [\($pfx): \($t)](\($i.url))"
    };

def bullets($fixes):
  map(select(if $fixes then is_fix else (is_fix | not) end))
  | map(select(.url != null and .url != ""))
  | map(bullet)
  | unique_by(.url)
  | sort_by(.key)
  | map(.line);

. as $items
| {
    features: ($items | bullets(false)),
    fixes: ($items | bullets(true))
  }
