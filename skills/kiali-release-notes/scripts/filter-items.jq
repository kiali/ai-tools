# Drop obvious CI/infra rows from release-note candidates.

def obvious_ci:
  (.title | test(
    "^\\[CI\\]|^\\(CI\\)|^\\(molecule\\)|\\(molecule\\)|jaeger-test molecule|"
    + "process labels trigger|ReportPortal|Playwright|Pin ambient multi-primary|"
    + "tag-release-creator|update supported release branches|"
    + "Fix act callbacks.*topology node tests|mirror\\.openshift|"
    + "^\\[tests\\]|^\\[dependabot\\]|Bump Go|CVE-[0-9]|fix\\(bookinfo\\)";
    "i"
  ));

[.[] | select(obvious_ci | not)]
