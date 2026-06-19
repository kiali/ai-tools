---
name: kiali-start
description: "Start Kiali in Minikube with Istio and Bookinfo demo. Variants: kiali-start:sidecar (default), kiali-start:ambient. Use when the user says \"start kiali\", \"kiali-start\", \"kiali-start:sidecar\", \"kiali-start:ambient\", or similar."
---

# Start Kiali Development Environment

Set up a local Kiali development environment in Minikube with Istio and
the Bookinfo demo application.

**Variants:**

- `kiali-start:sidecar` — standard Istio with sidecar injection (default)
- `kiali-start:ambient` — Istio Ambient mode (no sidecars)

If no variant is specified, use **sidecar** mode.

All commands below assume they are run from the parent directory where
the `kiali` repository is located (e.g. `kiali_sources/`).

## Step 1: Ensure Minikube Is Running

Check if Minikube is running. If not, start it:

```bash
minikube status || minikube start
```

## Step 2: Install Istio

### sidecar (default)

```bash
cd kiali/hack/istio && ./install-istio-via-istioctl.sh -c kubectl
```

### ambient

```bash
cd kiali/hack/istio && ./install-istio-via-istioctl.sh -c kubectl -cp ambient
```

## Step 3: Apply the Kiali Manifest

```bash
kubectl apply -f $(ls -t kiali/_output/istio-*/samples/addons/kiali.yaml | head -1)
```

## Step 4: Install the Bookinfo Demo

### sidecar (default)

```bash
cd kiali/hack/istio && ./install-bookinfo-demo.sh -c kubectl -tg
```

### ambient

```bash
cd kiali/hack/istio && ./install-bookinfo-demo.sh -c kubectl -ai false -tg -w true
```

## Step 5: Start Kiali with Port-Forwarding

```bash
cd kiali/hack && ./run-kiali.sh \
  -pg 13000:3000 \
  -pp 19090:9090 \
  -app 8080 \
  -es false \
  -iu http://127.0.0.1:15014 \
  -ke ~/go/bin/kiali_core \
  -hkc current \
  -cn Kubernetes
```

After startup the following services are available:

| Service    | URL                          |
|------------|------------------------------|
| Kiali UI   | http://localhost:13000       |
| Prometheus | http://localhost:19090       |
| Istiod     | http://localhost:15014       |

In **ambient** mode, you can also start Kiali from your IDE outside the
cluster using these environment variables:

```
KUBERNETES_SERVICE_HOST=127.0.0.1
KUBERNETES_SERVICE_PORT=18080
LOG_LEVEL=info
```

## Prerequisites

- **Minikube** installed and configured
- **kubectl** installed
- **Kiali binary** built at `~/go/bin/kiali_core` (`cd kiali && make build`)
- **Istio scripts** available in `kiali/hack/istio/`
