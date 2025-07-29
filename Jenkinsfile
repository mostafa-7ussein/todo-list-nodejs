pipeline {
    agent any

    environment {
        IMAGE_NAME = "mostafahu/todo-list-nodejs"
        REGISTRY_CREDENTIALS = "dockerhub-credentials"
        VERSION = "${env.BUILD_NUMBER}"
        DEPLOYMENT_NAMESPACE = "todo"
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

        // stage('Run Ansible Playbook') {
        //     steps {
        //         sshagent(credentials: ['ansible-ssh-key']) {
        //             sh '''
        //                 ansible-playbook -i ansible/hosts ansible/playbook.yaml --extra-vars "docker_image=${IMAGE_NAME}:${VERSION}"
        //             '''
        //         }
        //     }
        // }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh """
                        # تأكد أن النيمسبيس موجود
                        kubectl get ns ${DEPLOYMENT_NAMESPACE} || kubectl create ns ${DEPLOYMENT_NAMESPACE}

                        # استبدال اسم الصورة في ملفات YAML
                        find k8s/ -type f -name '*.yaml' -exec sed -i "s|{{ docker_image }}|${IMAGE_NAME}:${VERSION}|g" {} \\;

                        # تطبيق الملفات
                        kubectl apply -n ${DEPLOYMENT_NAMESPACE} -f k8s/
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

