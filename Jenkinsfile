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
                        string(credentialsId: 'docker_user_teens', variable: 'dockerUsername'),
                        string(credentialsId: 'docker_access_token_teens', variable: 'dockerAccessToken')
                    ]) {
                        env.dockerUsername = dockerUsername
                        env.dockerAccessToken = dockerAccessToken
                        env.dockerImageName = 'dockergointeens/frontend-games'
                    }
                }
            }
        }

        stage('Clone Repository') {
            steps {
                git 'git@github.com:goi-teens-academy/lms_game_Brawl-Stars_card-game.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def githubBranch = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                    def githubCommitHash = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    def currentDateTime = sh(script: 'date +"%Y-%m-%dT%H-%M-%S"', returnStdout: true).trim()
                    def dockerImageLabel = "${githubBranch}-${githubCommitHash}-${currentDateTime}".replace('\n', '').replace('\r', '')

                    env.dockerImageLabel = dockerImageLabel
                    env.dockerImageReadableLabel = githubBranch.equals('master') ? 'latest' : 'prod'

                    sh "docker build -t ${env.dockerImageName}:${dockerImageLabel} -t ${env.dockerImageName}:${dockerImageReadableLabel} ."
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    sh "echo ${env.dockerAccessToken} | docker login --username ${env.dockerUsername} --password-stdin"
                    sh "docker push ${env.dockerImageName}:${env.dockerImageLabel}"
                    sh "docker push ${env.dockerImageName}:${env.dockerImageReadableLabel}"
                }
            }
        }

        stage('Deploy via Docker Swarm') {
            steps {
                script {
                    sh """
                    docker stack deploy -c ${env.DOCKER_COMPOSE_FILE} ${env.STACK_NAME} --with-registry-auth
                    """
                }
            }
        }

        stage('Clean Up Docker Images') {
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
