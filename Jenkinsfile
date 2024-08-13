pipeline {
    agent {
        node {
            label 'goiteens'
        }
    }

    environment {
        DOCKER_IMAGE = "brawl_stars_card_game"
        DOCKER_CONTAINER_NAME = "brawl_stars_card_game_container"
        DOCKER_PORT_MAPPING = "9000:9000"
        SERVER_IP = "80.211.249.97"
        APP_DIR = "/root/lms_game_Brawl-Stars_card-game"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'git@github.com:goi-teens-academy/lms_game_Brawl-Stars_card-game.git'
            }
        }

        stage('Build Docker Image on Remote Server') {
            steps {
                script {
                    sh """
                    ssh root@${SERVER_IP} '
                        cd ${APP_DIR} &&
                        docker build -t ${DOCKER_IMAGE} .
                    '
                    """
                }
            }
        }

        stage('Force Stop and Remove Existing Container on Remote Server') {
            steps {
                script {
                    sh """
                    ssh root@${SERVER_IP} '
                        CONTAINER_ID=\$(docker ps -aq --filter "name=${DOCKER_CONTAINER_NAME}")
                        if [ "\$CONTAINER_ID" ]; then
                            docker stop \$CONTAINER_ID || true
                            docker rm -f \$CONTAINER_ID || true
                        fi

                        # Ensure the port is freed
                        PORT_PID=\$(lsof -ti:9000)
                        if [ "\$PORT_PID" ]; then
                            kill -9 \$PORT_PID || true
                        fi
                    '
                    """
                }
            }
        }

        stage('Deploy New Container on Remote Server') {
            steps {
                script {
                    sh """
                    ssh root@${SERVER_IP} '
                        docker run -d --name ${DOCKER_CONTAINER_NAME} -p ${DOCKER_PORT_MAPPING} ${DOCKER_IMAGE}
                    '
                    """
                }
            }
        }
    }

    post {
        always {
            script {
                sh "ssh root@${SERVER_IP} 'docker image prune -f'"
            }
        }
    }
}
