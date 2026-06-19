---
name: kiali-delete
description: Delete Kiali, Bookinfo, and Istio from Minikube. Use when the user says "delete kiali", "cleanup kiali", "teardown kiali", or similar.
---

# Delete Kiali Development Environment

Clean up the Kiali development environment from Minikube by removing
all deployed resources.

All commands below assume they are run from the parent directory where
the `kiali` repository is located (e.g. `kiali_sources/`).

## Step 1: Stop Running Kiali Processes

```bash
pkill -f run-kiali.sh
```

## Step 2: Delete the Bookinfo Demo

```bash
kubectl delete -f $(ls -t kiali/_output/istio-*/samples/addons/extras/zipkin.yaml | head -1) 2>/dev/null || true
kubectl delete namespace bookinfo 2>/dev/null || true
```

## Step 3: Delete Kiali

```bash
kubectl delete -f $(ls -t kiali/_output/istio-*/samples/addons/kiali.yaml | head -1) 2>/dev/null || true
```

## Step 4: Uninstall Istio

```bash
ISTIOCTL=$(ls -t kiali/_output/istio-*/bin/istioctl | head -1)
$ISTIOCTL uninstall --purge -y
kubectl delete namespace istio-system
```

## Step 5 (Optional): Delete the Minikube Cluster

If the user wants to remove the entire Minikube cluster:

```bash
minikube delete
```
