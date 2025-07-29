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

        stage('Run Ansible Playbook') {
            steps {
		    sh '''
			    ssh-keyscan -H 10.116.254.86 >> ~/.ssh/known_hosts
			    ansible-playbook -i ansible/hosts ansible/playbook.yaml --extra-vars "docker_image=${IMAGE_NAME}:${VERSION}"
                	'''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}

