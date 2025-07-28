pipeline {
    agent any
    environment {
        IMAGE_NAME = "mostafahu/todo-list-nodejs"
        DOCKER_CREDS = credentials('dockerhub-creds')
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/mostafa-7ussein/todo-list-nodejs.git'
            }
        }
        stage('Build & Push Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${BUILD_NUMBER}")
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDS) {
                        docker.image("${IMAGE_NAME}:${BUILD_NUMBER}").push()
                    }
                }
            }
        }
        stage('Deploy with Ansible') {
            steps {
                script {
                    ansiblePlaybook(
                        playbook: 'ansible/playbook.yml',
                        inventory: 'ansible/hosts',
                        extraVars: [
                            docker_image: "${IMAGE_NAME}:${BUILD_NUMBER}",
                            build_number: "${BUILD_NUMBER}"
                        ]
                    )
                }
            }
        }
    }
}
