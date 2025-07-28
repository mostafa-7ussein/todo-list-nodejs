pipeline {
    agent any

    environment {
        IMAGE_NAME = "mostafahu/todo-list-nodejs"
        REGISTRY_CREDENTIALS = "dockerhub-credentials"  // كما ذكرت
        APP_PORT = "4000"
        VERSION = "${env.BUILD_NUMBER}"
        ANSIBLE_DIR = "ansible"  // مجلد Ansible
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', 
                url: 'https://github.com/mostafa-7ussein/todo-list-nodejs.git'
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
                    // تحديث ملف playbook.yaml لاستخدام الإصدار الجديد
                    sh """
                        sed -i 's/docker_image: .*/docker_image: ${IMAGE_NAME}:${VERSION}/' ${ANSIBLE_DIR}/playbook.yaml
                    """
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                script {
                    dir(ANSIBLE_DIR) {
                        // تشغيل Ansible Playbook
                        ansiblePlaybook(
                            playbook: 'playbook.yaml',
                            inventory: 'hosts',
                            credentialsId: 'ansible-ssh-key',  // يجب تعريفها في Jenkins
                            disableHostKeyChecking: true
                        )
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        failure {
            slackSend channel: '#deploy-errors',
                     message: "Failed: ${JOB_NAME} #${VERSION}"
        }
    }
}
