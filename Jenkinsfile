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
                        sshUserPrivateKey(credentialsId: 'pasha-goitacad-ssh', keyFileVariable: 'GIT_SSH_KEY'),
                        string(credentialsId: 'docker_user_teens', variable: 'dockerUsername'),
                        string(credentialsId: 'docker_access_token_teens', variable: 'dockerAccessToken')
                    ]) {
                        env.dockerUsername = dockerUsername
                        env.dockerAccessToken = dockerAccessToken
                        env.GIT_SSH_KEY = GIT_SSH_KEY
                        env.dockerImageName = 'dockergointeens/frontend-games'
                    }
                }
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    git branch: 'master', credentialsId: 'pasha-goitacad-ssh', url: 'git@github.com:goi-teens-academy/lms_game_Brawl-Stars_card-game.git'
                }
            }
        }

        stage('Build Docker Image on Target Node') {
            steps {
                script {
                    sh """
                    docker build -t ${env.dockerImageName}:${env.dockerImageLabel} -t ${env.dockerImageName}:latest .
                    """
                }
            }
        }

        stage('Deploy via Docker Swarm') {
            steps {
                script {
                    sh """
                    docker stack deploy -c ${DOCKER_COMPOSE_FILE} ${STACK_NAME}
                    """
                }
            }
        }

        stage('Clean Up Docker Images on Target Node') {
            steps {
                script {
                    sh "docker image prune -f"
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
