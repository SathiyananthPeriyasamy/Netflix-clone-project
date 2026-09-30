pipeline {
    agent any

    tools {
        nodejs 'Node20' // Make sure this matches the exact name you gave it in step 2
    }

    environment {
        // Docker Hub & EC2 Configuration
        DOCKERHUB_USER = 'sathiyananth'
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub_cred'
        EC2_SSH_CREDENTIALS_ID = 'ec2-ssh-key'
        EC2_PUBLIC_IP = '13.50.110.118'
        EC2_USER = 'ubuntu'
        
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/netflix-frontend"
        BACKEND_IMAGE = "${DOCKERHUB_USER}/netflix-backend"
        BUILD_TAG = "${BUILD_NUMBER}"
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo '=== Pulling latest code from GitHub ==='
                checkout scm
            }
        }

        stage('2. Build Frontend & Backend') {
            steps {
                echo '=== Building Node.js dependencies ==='
                dir('backend') {
                    sh 'npm ci || npm install'
                }
                dir('frontend') {
                    sh 'npm ci || npm install'
                }
            }
        }

        stage('3. Build Docker Images') {
            steps {
                echo '=== Building Docker Container Images ==='
                script {
                    sh "docker build -t ${FRONTEND_IMAGE}:${BUILD_TAG} -t ${FRONTEND_IMAGE}:latest ./frontend"
                    sh "docker build -t ${BACKEND_IMAGE}:${BUILD_TAG} -t ${BACKEND_IMAGE}:latest ./backend"
                }
            }
        }

        stage('4. Push to Docker Hub') {
            steps {
                echo '=== Authenticating and Pushing Images to Docker Hub ==='
                withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    sh "docker push ${FRONTEND_IMAGE}:${BUILD_TAG}"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                    sh "docker push ${BACKEND_IMAGE}:${BUILD_TAG}"
                    sh "docker push ${BACKEND_IMAGE}:latest"
                }
            }
        }

        stage('5. Deploy to EC2 Instance') {
            steps {
                echo '=== Deploying Updated Containers to EC2 ==='
                sshagent([EC2_SSH_CREDENTIALS_ID]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_PUBLIC_IP} '
                            cd ~/Netflix-clone-project && \
                            git pull origin master && \
                            sudo docker compose down && \
                            sudo docker compose pull || true && \
                            sudo docker compose up -d --build
                        '
                    """
                }
            }
        }
    }

    post {
        always {
            echo '=== Cleaning up workspace ==='
            cleanWs()
        }
        success {
            echo "SUCCESS: Netflix Clone successfully built & deployed to http://${EC2_PUBLIC_IP}/"
        }
        failure {
            echo "FAILURE: Pipeline failed on build #${BUILD_NUMBER}"
        }
    }
}
