pipeline {
    agent any

    environment {
        // Change these to your actual Docker Hub username and EC2 IP
        DOCKERHUB_USER = 'sathiyananth'
        DOCKERHUB_CREDENTIALS_ID = 'Sathiya@051'
        EC2_SSH_CREDENTIALS_ID = '-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEA24+hNqz7wkKnvw3QEzjOmCa44fB9QkVQMIVM2JYJpiPiEdm0
4r+i6t780ur+ER9bugNhw9dAzVFZUgWKXbmIMajMJTdcOyLL8YOFBBfWTVwnnkbc
PnpO7uTHJvbFP5llM9MXq3x3ja3OfL3rGADpC9+YGn9HpN1eG6ELWaJNCPtMpHZb
0EQUZHgvO0wUACsdbzvTB6bX/0X/eS0G2acgENpNdmhIRJWh9obYZNUrhQ7d8sAP
ITvZWw35IRnEDK8BEMdjkB1AhiNLGQnmVzWMdam+oTfmaw3prN6WjjTTGZ5QG5Ko
g5pUvNZFUHPYgh4x1RHj5xp2yG6VlFJFH++ZwwIDAQABAoIBAHnjx+0RpYaX+IZR
RcWWEONZA+Sy3OcQkc8OAbZvvRWV8ChWw1vqZaiceKEjQj8BOKwQupK9ikUxtzOY
zdLwcBKZkhPLIxHVZIFEsXCvRxKVaY0t65Fn1zA6o/EWqDSBlTRrKUXTiI+IAQ0x
ZjViM/6ad9el94EoP9l401NEjh3AVdAVOL4zLd4rTRuvlgONx5O02hYObzuKXVPc
6aRfZbdtPbJi5oiSgpGSUU07/SwA1tEJBgt7Z33j44JSaqiM0YRaJ7bpe7qiYapk
BzeFS11wkrb1fb+HufV2Bsc+8y9RWhfoaEYxwOm7BW0ZFLXHlyZ95XDTVd9kifcX
gh6K0wkCgYEA9QRmUTymOgPNm2QC7cdhF+HhAnULH0XGHBBBtw3r7UoHVZwJYwke
wbjUeaieI+13AHd6A6qF8iLEABPlDyF32ES5u3YDNWHD2N1k3B/zXpqmuYu0D4vG
/wkOgIz7TMWIFR7qrB711rpHdiiqBZudb5awYiUnI9BIGbWDh8lFYPUCgYEA5Wce
Nqt78BT9f2+YOY50/NZ+Wzc18np1I0pWgzNf/moCWXSbsj6IJ+7M0C1FfH4WM82c
67vTE2CY00laMGCMdZqHCBNzehFaYpJnYkyBIFHTjyqxUuEC+mSK/swcJTSGhOMK
a/vfXu86zy7HYjOjqLj8vbyRv1nEtm27TdIS/NcCgYBwed2Sa1oPhdFsBQRHLWDH
+tw1KY+6gmhIV7ojE1P7sSEezquMeBJTccqwMpSt/4PChhZP+obUudrqAjgDsyR1
9k6g3LLqXX/vXOrBFjW9dxcUVCqLfGoUh47NumpeOsuWjoPCEdBfC1JkzpQGUQJ7
yFweIdoO2b1PeADyY5XixQKBgBElDcsEMfUVfISjsHrMvM2Qskza6Xs/z7Vdfu27
TzdScO6CmohNyBtD66a7W3AcdEhW2516oiHWnFVeLBFlhdncPK9L1NuQpHKtgnCE
SzpBI1CV3j7VdkWEcibs1kWpkUwpM8QyRNVxh7GoS1p5hYe8m5cKmtH0QZFozhDY
3HZtAoGATTUlM5KTFPvO3sc79JVjxftAZ2KaJWevMdPUzhtiG5VJ5UV3WuAW362r
ajtr+NJLNeGTT9s/NLS/VFwXLeEdfO0XMyuhl9tWKDShR4iYPN0CyW7+d4NdbXDh
32GZkOcF6A8fwEl3/3XPwdcIr+Cku8++KuiGIGzwiY93vRzwzuk=
-----END RSA PRIVATE KEY-----'
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
                echo '=== Building Node.js dependencies & assets ==='
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
                echo '=== Deploying Updated Containers to Amazon Linux 2023 EC2 ==='
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
