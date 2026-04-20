# Cursor Rules for Kiali Development

This directory contains a collection of custom rules for Cursor to streamline Kiali development workflows with Minikube, Istio, and the Bookinfo demo application.

## Installation

To use these rules in Cursor, you need to link them to the `.cursor/rules/` directory in the parent directory of your Kiali repositories.

### Quick Install (Recommended - Using Symlink)

From the `kiali_sources` directory, run:

```bash
# Create the .cursor directory if it doesn't exist
mkdir -p .cursor

# Create a symbolic link to the rules directory
ln -sf "$(pwd)/ai-tools/cursor/.cursor/rules" .cursor/rules

# Verify installation
ls -la .cursor/rules/
```

Using a symlink means any updates to `ai-tools/cursor/.cursor/rules/` will be automatically reflected in Cursor without needing to copy files.

### Alternative Install (Copy Files)

If you prefer to copy the files instead of using a symlink:

```bash
# Create the .cursor/rules directory
mkdir -p .cursor/rules

# Copy the rules
cp ai-tools/cursor/.cursor/rules/*.mdc .cursor/rules/

# Verify installation
ls -la .cursor/rules/
```

**Note:** With this method, you'll need to manually copy files again whenever the rules in `ai-tools/cursor/.cursor/rules/` are updated.

### Verify Installation

After installation, the rules will be available in Cursor. You can reference them by name when asking Cursor to perform tasks:
- `start-kiali` - Start Kiali with standard Istio
- `start-kiali-ambient` - Start Kiali with Istio Ambient mode
- `delete-kiali` - Clean up Kiali environment
- `check-syntax` - Validate syntax of kiali.io documentation

**Important:** The `.cursor` directory is in your personal workspace and won't be committed to git. The `ai-tools/cursor` directory is the source of truth and is version-controlled.

### Prerequisites

Before using these rules, ensure you have the following installed:

1. **Minikube** - Local Kubernetes cluster
   ```bash
   # Fedora/RHEL
   sudo dnf install minikube

   # Or download from https://minikube.sigs.k8s.io/docs/start/
   ```

2. **kubectl** - Kubernetes CLI
   ```bash
   sudo dnf install kubernetes-client
   ```

3. **Kiali binary** - Built and available at `~/go/bin/kiali_core`
   ```bash
   cd kiali
   make build
   ```

4. **Istio installation scripts** - Located in `kiali/hack/istio/`
   - `install-istio-via-istioctl.sh`
   - `install-bookinfo-demo.sh`
   - `run-kiali.sh` (in `kiali/hack/`)

## Available Rules

### `start-kiali`

Starts Kiali in Minikube with standard Istio (sidecar mode) and the Bookinfo demo.

**What it does:**
1. Checks if Minikube is running (starts it if needed)
2. Installs Istio with sidecars enabled
3. Applies the Kiali manifest
4. Installs the Bookinfo demo application
5. Starts Kiali with port-forwarding

**Usage:**
```
start-kiali
```

**Access after startup:**
- Kiali UI: http://localhost:13000

---

### `start-kiali-ambient`

Starts Kiali in Minikube with Istio **Ambient mode** (no sidecars) and the Bookinfo demo.

**What it does:**
1. Checks if Minikube is running (starts it if needed)
2. Installs Istio with Ambient mode enabled (uses ztunnel and waypoint proxies)
3. Applies the Kiali manifest
4. Installs the Bookinfo demo with Ambient support
5. Sets up port-forwards for all required services

**Usage:**
```
start-kiali-ambient
```

**Services available:**
- Istiod: `localhost:15014`
- Prometheus: `localhost:19090`
- Grafana: `localhost:13000`
- Jaeger (Tracing): `localhost:16686`
- Kubernetes API Proxy: `localhost:18080`

**Note:** After running this rule, you can start Kiali from your IDE using these port-forwards.

---

### `delete-kiali`

Cleans up the Kiali environment from Minikube, removing all deployed resources.

**What it does:**
1. Stops any running Kiali processes
2. Deletes the Bookinfo demo and its namespace
3. Deletes Kiali resources
4. Uninstalls Istio completely
5. Deletes the istio-system namespace

**Usage:**
```
delete-kiali
```

**Optional:** To completely remove the Minikube cluster:
```bash
minikube delete
```

---

### `check-syntax`

Validates syntax and content quality of uncommitted files in the kiali.io documentation repository.

**What it does:**
1. Automatically locates the kiali.io repository (checks common parent directories)
2. Analyzes all uncommitted changes using `git diff`
3. Performs comprehensive syntax validation based on file type:
   - **Markdown files**: Checks for unclosed code blocks, Hugo shortcodes, front matter, malformed links, and spelling/grammar errors
   - **TOML files**: Validates TOML syntax structure
   - **JSON files**: Validates JSON syntax
   - **HTML/Template files**: Checks for unclosed HTML tags and Go template syntax
4. Presents each issue with:
   - File name and line number
   - Issue type (e.g., "Spelling error", "Unclosed code block")
   - Current problematic text
   - **Suggested:** corrected version
5. Asks if you want to apply the suggested fixes
6. Automatically applies all corrections if approved

**Usage:**
```
check-syntax
```

**Example output:**
```
## Syntax Validation Report

**File:** content/en/docs/Configuration/perses.md

### Issues Found:

#### Issue 1
- **Line:** 80
- **Type:** Spelling error
- **Current:** "you must follow te perses staeps"
- **Suggested:** "you must follow the Perses steps"

### Summary:
- Total files checked: 1
- Total issues found: 1
- Status: ✗ Issues found

Do you want to apply the suggested fixes automatically?
```

**Prerequisites:**
- The kiali.io repository should be in a parent directory (`../kiali.io` or `../../kiali.io`)
- Git repository with uncommitted changes to validate

**Note:** This rule focuses on both syntax validation and content quality (spelling/grammar) to ensure documentation is error-free before committing.

---

## Typical Workflow

### Standard Development (with sidecars)

```bash
# 1. Start the environment
start-kiali

# 2. Develop and test your changes
# 3. When done, clean up
delete-kiali
```

### Ambient Mode Development (sidecar-less)

```bash
# 1. Start the environment with Ambient mode
start-kiali-ambient

# 2. The services are now running with port-forwards
# 3. Start Kiali from your IDE/debugger with:
#    KUBERNETES_SERVICE_HOST=127.0.0.1
#    KUBERNETES_SERVICE_PORT=18080
#    LOG_LEVEL=info
#    kiali_core -config /path/to/config.yaml

# 4. When done, clean up
delete-kiali
```

### Documentation Validation

```bash
# 1. Make changes to kiali.io documentation
# 2. Before committing, validate syntax and content
check-syntax

# 3. Review the issues found
# 4. Accept the suggested fixes (or fix manually)
# 5. Commit your changes
```

---

## Customization

### Modifying Rules

The rule files are located in `ai-tools/cursor/.cursor/rules/`:
- `start-kiali.mdc` - Standard Istio setup
- `start-kiali-ambient.mdc` - Ambient mode setup
- `delete-kiali.mdc` - Cleanup procedure
- `check-syntax.mdc` - Syntax validation for kiali.io documentation

To customize a rule:
1. Edit the file in `ai-tools/cursor/.cursor/rules/` (this is the source of truth)
2. If you used symlinks, changes are automatically reflected
3. If you copied files, copy the modified file to `.cursor/rules/` to activate the changes
4. Restart Cursor or reload the rules

### Adding New Rules

To add a new rule:

1. Create a new `.mdc` file in `ai-tools/cursor/.cursor/rules/`
2. Name it with your rule (e.g., `my-rule.mdc`)
3. Write the rule description and instructions (see example below)
4. Copy it to `.cursor/rules/` to make it available (or use symlink)
5. The rule will be available when you reference it by name in Cursor

**Example rule structure:**
```markdown
---
description: [Describe what the rule does]
globs: 
alwaysApply: false
---

# [Rule Name]

Execute the following steps to [describe what the rule does]:

1. First step with description:
   ```bash
   command to run
   ```

2. Second step:
   ```bash
   another command
   ```

Note: Any important notes or warnings.
```

---

## Troubleshooting

### Minikube not starting
```bash
minikube status
minikube start
```

### Port conflicts
If ports 8080, 13000, 15014, 16686, or 19090 are already in use:
```bash
# Find what's using the port
lsof -i :8080

# Kill the process or modify the port-forward commands
```

### Istio installation fails
```bash
# Check Minikube has enough resources
minikube config set memory 8192
minikube config set cpus 4
minikube delete
minikube start
```

### Cannot find kiali_core binary
```bash
# Build Kiali
cd kiali
make build

# Verify the binary exists
ls -la ~/go/bin/kiali_core
```

---

## Additional Resources

- [Kiali Documentation](https://kiali.io/docs/)
- [Istio Ambient Mesh](https://istio.io/latest/docs/ambient/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [Cursor Documentation](https://cursor.sh/docs)

---

## Contributing

When adding or modifying rules:

1. Test the rule thoroughly in a clean environment
2. Document all prerequisites and expected outcomes
3. Include error handling and helpful messages
4. Update this README with the new rule details

---

**Last Updated:** November 14, 2025

