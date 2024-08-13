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

        stage('Verify GitHub Pull') {
            steps {
                script {
                    sh "git log -1 --pretty=%B"
                }
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
                        if [ \$(docker ps -q --filter "name=${DOCKER_CONTAINER_NAME}") ]; then
                            docker stop ${DOCKER_CONTAINER_NAME}
                            docker rm ${DOCKER_CONTAINER_NAME}
                        fi

                        # Ensure the port is freed
                        if lsof -ti:9000; then
                            kill -9 \$(lsof -ti:9000)
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
