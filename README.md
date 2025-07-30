# 📝 To-Do List Node.js App

A To-Do List application built using Node.js and MongoDB. It includes a full CI/CD pipeline using Jenkins, Docker, and Ansible, with optional Kubernetes deployment for production environments.

---

## 🧰 Technologies Used

- Node.js 16
- MongoDB
- Docker & Docker Compose
- Kubernetes (Optional)
- Jenkins (CI/CD)
- DockerHub (Container Registry)
- Ansible (Remote Deployment)
- ngrok (GitHub Webhook)
- GitHub

---

## 🚀 Run Locally

### Requirements:

- Docker
- Docker Compose

### Steps:

```bash
git clone https://github.com/mostafa-7ussein/todo-list-nodejs.git
cd todo-list-nodejs
docker compose up -d
```

The application will run at: [http://localhost:4000](http://localhost:4000)

---

## ⚙️ `docker-compose.yml` File

- Contains two services:
  - `app`: Node.js image built from Dockerfile.
  - `mongo`: MongoDB database with a persistent Volume.
- Uses a custom network `todo-net` for service communication.

---

## 🐳 Dockerfile

Used to build the application image from the source code:

```Dockerfile
FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

---

## 🔄 Jenkins CI/CD Pipeline

Using the `Jenkinsfile`:

1. Pull code from GitHub.
2. Build the Docker Image.
3. Push the image to DockerHub.
4. Deploy the service using `docker compose up -d`.

---

## 🔐 Webhook with Ngrok

ngrok is configured to connect GitHub with Jenkins via a Webhook using a temporary URL updated on each run.

---

## 📡 Remote Deployment with Ansible

### Location: `ansible/`

- Connects to a remote Ubuntu 24.04 server at IP: `10.116.254.86`.
- Installs Docker and Docker Compose.
- Copies the `docker-compose.yml` file.
- Automatically starts the application.

### Steps:

```bash
cd ansible
ansible-playbook -i hosts playbook.yaml
```

---

## ☸️ Kubernetes Deployment

### Location: `k8s/`

You can run the application on a Kubernetes cluster using the following manifests:

- `namespace.yaml`: Creates a dedicated namespace.
- `mongo-deployment.yaml`: Deploys MongoDB.
- `mongo-service.yaml`: Exposes MongoDB as a ClusterIP service.
- `mongo-pvc.yaml`: Adds persistent volume claim for MongoDB.
- `app-deployment.yaml`: Deploys the Node.js application.
- `app-service.yaml`: Exposes the app (NodePort or LoadBalancer).

### Steps:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/
```

> Make sure to configure `MONGO_URL` in your deployment YAML to match your service name (`mongodb://mongo:27017/todo_db`).

---

## 🧪 Project Structure

```
todo-list-nodejs/
├── ansible/
│   ├── ansible.cfg
│   ├── docker-compose.yml
│   ├── hosts
│   └── playbook.yaml
├── k8s/
│   ├── app-deployment.yaml
│   ├── app-service.yaml
│   ├── mongo-deployment.yaml
│   ├── mongo-pvc.yaml
│   ├── mongo-service.yaml
│   └── namespace.yaml
├── Dockerfile
├── Jenkinsfile
├── docker-compose.yml
├── ...
```

---

## 👨‍💻 Author

- **Mostafa Hussein**
- [GitHub Profile](https://github.com/mostafa-7ussein)

---

## 📄 License

MIT License – Free to use for any purpose.
