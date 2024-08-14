@Library('jenkins-common')_

pipeline {
    agent {
        node {
            label 'goiteens'
        }
    }

    environment {
        IMAGE_NAME = "brawl-game:latest"
        IMAGE_FILE = "/tmp/brawl-game-latest.tar"
        REMOTE_NODE_IP = "80.211.249.97"
    }

    stages {
        stage('Load Credentials') {
            steps {
                script {
                    withCredentials([
                        sshUserPrivateKey(credentialsId: 'automation_ssh_key_devops', keyFileVariable: 'SSH_KEY_PATH'),
                        string(credentialsId: 'docker_user_teens', variable: 'dockerUsername'),
                        string(credentialsId: 'docker_access_token_teens', variable: 'dockerAccessToken')
                    ]) {
                        env.dockerUsername = dockerUsername
                        env.dockerAccessToken = dockerAccessToken
                        env.SSH_KEY_PATH = "${SSH_KEY_PATH}"
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

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                    docker build -t brawl-game:latest .
                    """
                }
            }
        }

        stage('Save and Transfer Docker Image') {
            steps {
                script {
                    sh "docker save -o ${env.IMAGE_FILE} brawl-game:latest"

                    sh "scp -i \"${env.SSH_KEY_PATH}\" ${env.IMAGE_FILE} root@${env.REMOTE_NODE_IP}:/tmp/"

                    sh "ssh -i \"${env.SSH_KEY_PATH}\" root@${env.REMOTE_NODE_IP} 'docker load -i /tmp/brawl-game-latest.tar'"
                }
            }
        }


        stage('Deploy via Docker Swarm') {
            steps {
                script {
                    sh """
                    docker stack deploy -c brawl-docker-compose.yml brawl-game --with-registry-auth
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
