pipeline {
    agent any

    environment {
        IMAGE_NAME = "mostafahu/todo-list-nodejs"
        REGISTRY_CREDENTIALS = "dockerhub-credentials"
        VERSION = "${env.BUILD_NUMBER}"

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
                        dockerImage.push()  // push only versioned tag
                    }
                }
            }
        }
	stage('Deploy') {
	    steps {
		script {
		    sh """
		        export VERSION=${VERSION}
		        docker compose up -d
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

