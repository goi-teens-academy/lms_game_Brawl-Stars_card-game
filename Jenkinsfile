@Library('jenkins-common')_

pipeline {
    agent {
        node {
            label 'goiteens'
        }
    }

    environment {
        DOCKER_COMPOSE_FILE = "/root/brawl-docker-compose.yml"
        STACK_NAME = "brawl-game"
    }

    stages {
        stage('Load Credentials') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'ssh_key', variable: 'SSH_KEY')
                    ]) {
                        env.SSH_KEY = SSH_KEY
                    }
                }
            }
        }

        stage('Clone Repository') {
            steps {
                git 'git@github.com:goi-teens-academy/lms_game_Brawl-Stars_card-game.git'
            }
        }

        stage('Build Docker Image on Target Node') {
            steps {
                script {
                    sh """
                    ssh -i ${env.SSH_KEY} root@${SERVER_IP} '
                        cd /root/lms_game_Brawl-Stars_card-game &&
                        docker build -t brawl-game:latest .
                    '
                    """
                }
            }
        }

        stage('Deploy via Docker Swarm') {
            steps {
                script {
                    sh """
                    ssh -i ${env.SSH_KEY} root@${SERVER_IP} '
                        docker stack deploy -c ${DOCKER_COMPOSE_FILE} ${STACK_NAME}
                    '
                    """
                }
            }
        }

        stage('Clean Up Docker Images on Target Node') {
            steps {
                script {
                    sh """
                    ssh -i ${env.SSH_KEY} root@${SERVER_IP} '
                        docker image prune -f
                    '
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
