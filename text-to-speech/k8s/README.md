# Kubernetes Deployment

## Prerequisites
- Kubernetes cluster (minikube, GKE, EKS, AKS, etc.)
- kubectl configured
- Docker images built and pushed to registry

## Deployment Steps

1. Create secrets:
```bash
kubectl apply -f secrets.yaml
```

2. Deploy infrastructure:
```bash
kubectl apply -f postgres-deployment.yaml
kubectl apply -f redis-deployment.yaml
```

3. Deploy services:
```bash
kubectl apply -f auth-service-deployment.yaml
kubectl apply -f user-service-deployment.yaml
kubectl apply -f tts-service-deployment.yaml
kubectl apply -f admin-service-deployment.yaml
kubectl apply -f api-gateway-deployment.yaml
kubectl apply -f frontend-deployment.yaml
```

4. Run database migrations:
```bash
kubectl exec -it <user-service-pod> -- npm run migrate
```

5. Seed database:
```bash
kubectl exec -it <user-service-pod> -- npm run seed
```

## Scaling

To scale services:
```bash
kubectl scale deployment auth-service --replicas=5
kubectl scale deployment tts-service --replicas=10
```

## Monitoring

Check service status:
```bash
kubectl get pods
kubectl get services
kubectl logs <pod-name>
```

