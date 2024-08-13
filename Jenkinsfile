pipeline {
    agent {
        node {
            label 'goiteens'
        }
    }

    environment {
        DOCKER_IMAGE = "brawl_stars_card_game"
        DOCKER_CONTAINER_NAME = "nifty_archimedes"
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

        stage('Stop and Remove Existing Container on Remote Server') {
            steps {
                script {
                    sh """
                    ssh root@${SERVER_IP} '
                        # Stop and remove the existing container if it's running
                        CONTAINER_ID=\$(docker ps -aq --filter "name=${DOCKER_CONTAINER_NAME}")
                        if [ "\$CONTAINER_ID" ]; then
                            echo "Found container with ID: \$CONTAINER_ID"
                            docker stop \$CONTAINER_ID
                            docker rm -f \$CONTAINER_ID
                        else
                            echo "No container found with name ${DOCKER_CONTAINER_NAME}"
                        fi

                        # Ensure the port is freed
                        PORT_PID=\$(lsof -ti:9000)
                        if [ "\$PORT_PID" ]; then
                            echo "Killing process using port 9000 with PID: \$PORT_PID"
                            kill -9 \$PORT_PID
                        else
                            echo "No process found using port 9000"
                        fi

                        # Double-check to ensure the port is free
                        while lsof -ti:9000; do
                            echo "Waiting for port 9000 to be free..."
                            sleep 1
                        done
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
