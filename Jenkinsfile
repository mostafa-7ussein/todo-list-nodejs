pipeline {
    agent any

    environment {
        IMAGE_NAME = "mostafahu/todo-list-nodejs"
        REGISTRY_CREDENTIALS = "dockerhub-credentials"
        APP_PORT = "4000"
        VERSION = "${env.BUILD_NUMBER}"
        ANSIBLE_DIR = "ansible"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', 
                url: 'https://github.com/mostafa-7ussein/todo-list-nodejs.git'
            }
        }

        stage('Verify Files') {
            steps {
                script {
                    sh """
                        echo "Checking ansible directory contents:"
                        ls -la ${ANSIBLE_DIR}/
                        echo "\nContents of playbook.yaml:"
                        cat ${ANSIBLE_DIR}/playbook.yaml
                    """
                }
            }
        }

        stage('Build & Push') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${VERSION}")
                    
                    docker.withRegistry('https://index.docker.io/v1/', "${REGISTRY_CREDENTIALS}") {
                        docker.image("${IMAGE_NAME}:${VERSION}").push()
                        docker.image("${IMAGE_NAME}:latest").push()
                    }
                }
            }
        }

        stage('Update Ansible Variables') {
            steps {
                script {
                    sh """
                        echo "Updating docker image in playbook.yaml"
                        sed -i 's|docker_image: .*|docker_image: ${IMAGE_NAME}:${VERSION}|' ${ANSIBLE_DIR}/playbook.yaml
                        echo "Updated playbook content:"
                        cat ${ANSIBLE_DIR}/playbook.yaml | grep docker_image:
                    """
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                script {
                    dir(ANSIBLE_DIR) {
                        sh 'pwd && ls -la'
                        ansiblePlaybook(
                            playbook: 'playbook.yaml',
                            inventory: 'hosts',
                            credentialsId: 'ansible-ssh-key',
                            disableHostKeyChecking: true,
                            extras: '-vvv' // زيادة مستوى التفاصيل
                        )
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            sh "docker system prune -f || true"
        }
        failure {
            echo "Pipeline failed! Please check the logs."
            // يمكنك إضافة إشعارات أخرى هنا مثل البريد الإلكتروني
        }
    }
}
