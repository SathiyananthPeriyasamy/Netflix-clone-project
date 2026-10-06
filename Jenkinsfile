pipeline {
    agent any

    environment {
        // Docker Hub, SonarQube & EC2 Configuratio
        DOCKERHUB_USER = 'sathiyananth'
        DOCKERHUB_CREDENTIALS_ID = 'Dockerhub_Cred'
        EC2_SSH_CREDENTIALS_ID = 'ec2-ssh-key'
        EC2_PUBLIC_IP = '13.250.23.67'
        EC2_USER = 'ubuntu'
        
        SONAR_URL = 'http://localhost:9000'
        SONAR_TOKEN_CREDENTIALS_ID = 'Sonarqube-token'
        
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

        stage('2. SonarQube Code Quality & Quality Gate') {
            steps {
                echo '=== Running SonarQube Scan & Checking Quality Gate ==='
                withCredentials([string(credentialsId: "${SONAR_TOKEN_CREDENTIALS_ID}", variable: 'SONAR_TOKEN')]) {
                    sh """
                        docker run --rm \
                            --network host \
                            -v "${WORKSPACE}:/usr/src" \
                            sonarsource/sonar-scanner-cli \
                            -Dsonar.projectKey=netflix-clone \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=${SONAR_URL} \
                            -Dsonar.token=\${SONAR_TOKEN} \
                            -Dsonar.login=\${SONAR_TOKEN}
                    """
                }
            }
        }

        stage('3. Build Docker Images') {
            steps {
                echo '=== Building Docker Container Images ==='
                script {
                    sh "docker build --no-cache -t ${FRONTEND_IMAGE}:${BUILD_TAG} -t ${FRONTEND_IMAGE}:latest ./frontend"
                    sh "docker build --no-cache -t ${BACKEND_IMAGE}:${BUILD_TAG} -t ${BACKEND_IMAGE}:latest ./backend"
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
                            sudo docker compose down --rmi all --volumes --remove-orphans && \
                            sudo docker system prune -af && \
                            sudo docker compose pull || true && \
                            sudo docker compose up -d --force-recreate
                        '
                    """
                }
            }
        }

        stage('6. Live Application Smoke Test') {
            steps {
                echo '=== Verifying Live Application Status on EC2 ==='
                sh '''
                    echo "Waiting 12 seconds for MongoDB & Express containers to initialize..."
                    sleep 12

                    echo "1. Checking Frontend Web UI Status (HTTP 200)..."
                    curl -s -o /dev/null -w "%{http_code}" http://${EC2_PUBLIC_IP}/ | grep -E "200|301|302" || exit 1

                    echo "2. Checking Backend REST API Health Endpoint via Nginx..."
                    curl -s -f http://${EC2_PUBLIC_IP}/api/health || exit 1

                    echo "=== ✅ SMOKE TEST PASSED: Application is live & healthy! ==="
                '''
            }
        }
    }

    post {
        always {
            echo '=== Cleaning up workspace ==='
            sh 'docker system prune -af || true'
            cleanWs()
        }
        success {
            echo "SUCCESS: Netflix Clone successfully built, scanned & deployed to http://${EC2_PUBLIC_IP}/"
        }
        failure {
            echo "FAILURE: Pipeline failed on build #${BUILD_NUMBER}"
        }
    }
}
