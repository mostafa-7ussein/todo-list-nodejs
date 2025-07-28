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
                    // استخدام | كفاصل بدلاً من / لتجنب المشاكل مع المسارات
                    sh """
                        sed -i 's|docker_image: .*|docker_image: ${IMAGE_NAME}:${VERSION}|' ${ANSIBLE_DIR}/playbook.yaml
                    """
                    // خطوة إضافية للتحقق من التعديل
                    sh "cat ${ANSIBLE_DIR}/playbook.yaml | grep docker_image:"
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
                            credentialsId: 'ansible-ssh-key',
                            disableHostKeyChecking: true,
                            extras: '-v' // وضع verbose لرؤية التفاصيل
                        )
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            // إضافة خطوة لتنظيف الصور القديمة إن أردت
            sh "docker system prune -f || true"
        }
        failure {
            // تم إزالة إشعار Slack أو يمكنك تثبيت الملحق أولاً
            echo "Pipeline failed! Please check the logs."
        }
    }
}
