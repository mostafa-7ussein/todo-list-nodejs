pipeline {
    agent any

    environment {
        IMAGE_NAME = "mostafahu/todo-list-nodejs"
        IMAGE_TAG = "v1"
        REGISTRY_CREDENTIALS = "dockerhub-credentials"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/mostafa-7ussein/todo-list-nodejs.git', branch: 'master'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('', "${REGISTRY_CREDENTIALS}") {
                        docker.image("${IMAGE_NAME}:${IMAGE_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                sh '''
                    ansible-playbook ansible/deploy_app.yml -i ansible/inventory.ini
                '''
            }
        }
    }
}

