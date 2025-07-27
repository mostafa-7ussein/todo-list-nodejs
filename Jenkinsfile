pipeline {
    agent any

    environment {
        IMAGE_NAME = "mostafahu/todo-list-nodejs"
        REGISTRY_CREDENTIALS = "dockerhub-credentials"
        CONTAINER_NAME = "todo-list-container"
        APP_PORT = "4000"
        VERSION = "${env.BUILD_NUMBER}"   // هنا نستخدم رقم البناء من Jenkins كنسخة
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
                    dockerImage = docker.build("${IMAGE_NAME}:${VERSION}")
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${REGISTRY_CREDENTIALS}") {
                        dockerImage.push()                    
                        dockerImage.push("latest")           
                    }
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    sh """
                        if [ \$(docker ps -aq -f name=${CONTAINER_NAME}) ]; then
                            docker rm -f ${CONTAINER_NAME}
                        fi
                    """
                    sh """
                        docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:${APP_PORT} ${IMAGE_NAME}:${VERSION}
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
