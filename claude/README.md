# Claude Code Commands for Kiali Development

This directory contains custom slash commands for Claude Code to streamline Kiali development workflows with Minikube, Istio, and the Bookinfo demo application.

## Installation

These commands are project-scoped and automatically available when you open Claude Code in this repository.

### Prerequisites

Before using these commands, ensure you have the following installed:

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

## Available Commands

### `/start-kiali`

Starts Kiali in Minikube with standard Istio (sidecar mode) and the Bookinfo demo.

**What it does:**
1. Checks if Minikube is running (starts it if needed)
2. Installs Istio with sidecars enabled
3. Applies the Kiali manifest
4. Installs the Bookinfo demo application
5. Starts Kiali with port-forwarding

**Usage:**
```
/start-kiali
```

**Access after startup:**
- Kiali UI: http://localhost:13000

---

### `/start-kiali-ambient`

Starts Kiali in Minikube with Istio **Ambient mode** (no sidecars) and the Bookinfo demo.

**What it does:**
1. Checks if Minikube is running (starts it if needed)
2. Installs Istio with Ambient mode enabled (uses ztunnel and waypoint proxies)
3. Applies the Kiali manifest
4. Installs the Bookinfo demo with Ambient support
5. Sets up port-forwards for all required services

**Usage:**
```
/start-kiali-ambient
```

**Services available:**
- Istiod: `localhost:15014`
- Prometheus: `localhost:19090`
- Grafana: `localhost:13000`
- Jaeger (Tracing): `localhost:16686`
- Kubernetes API Proxy: `localhost:18080`

**Note:** After running this command, you can start Kiali from your IDE using these port-forwards.

---

### `/delete-kiali`

Cleans up the Kiali environment from Minikube, removing all deployed resources.

**What it does:**
1. Stops any running Kiali processes
2. Deletes the Bookinfo demo and its namespace
3. Deletes Kiali resources
4. Uninstalls Istio completely
5. Deletes the istio-system namespace

**Usage:**
```
/delete-kiali
```

**Optional:** To completely remove the Minikube cluster:
```bash
minikube delete
```

---

## Typical Workflow

### Standard Development (with sidecars)

```bash
# 1. Start the environment
/start-kiali

# 2. Develop and test your changes
# 3. When done, clean up
/delete-kiali
```

### Ambient Mode Development (sidecar-less)

```bash
# 1. Start the environment with Ambient mode
/start-kiali-ambient

# 2. The services are now running with port-forwards
# 3. Start Kiali from your IDE/debugger with:
#    KUBERNETES_SERVICE_HOST=127.0.0.1
#    KUBERNETES_SERVICE_PORT=18080
#    LOG_LEVEL=info
#    kiali_core -config /path/to/config.yaml

# 4. When done, clean up
/delete-kiali
```

---

## Customization

### Modifying Commands

The command definitions are located in `ai-tools/.claude/commands/`:
- `start-kiali.md` - Standard Istio setup
- `start-kiali-ambient.md` - Ambient mode setup
- `delete-kiali.md` - Cleanup procedure

You can edit these files to customize the behavior of each command.

### Adding New Commands

1. Create a new `.md` file in `ai-tools/.claude/commands/`
2. Name it with your command (e.g., `my-command.md`)
3. Write the command description and instructions
4. The command will be available as `/my-command` in Claude Code

**Example command structure:**
```markdown
Execute the following steps to [describe what the command does]:

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
- [Claude Code Documentation](https://docs.claude.com/claude-code)

---

## Contributing

When adding or modifying commands:

1. Test the command thoroughly in a clean environment
2. Document all prerequisites and expected outcomes
3. Include error handling and helpful messages
4. Update this README with the new command details

---

**Last Updated:** November 2025
