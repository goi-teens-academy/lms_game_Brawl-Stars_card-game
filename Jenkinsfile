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
        IMAGE_NAME = "dockergointeens/frontend-games:latest"
        IMAGE_FILE = "/tmp/brawl-game-latest.tar"
        NODE_IP = "80.211.249.97"
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
                        env.SSH_KEY_PATH = SSH_KEY_PATH
                        env.dockerUsername = dockerUsername
                        env.dockerAccessToken = dockerAccessToken
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
                    docker build -t ${env.IMAGE_NAME} .
                    """
                }
            }
        }

        stage('Save and Distribute Image') {
            steps {
                script {
                    sh "docker save -o ${env.IMAGE_FILE} ${env.IMAGE_NAME}"

                    sh """
                    scp -i ${env.SSH_KEY_PATH} ${env.IMAGE_FILE} root@${env.NODE_IP}:/tmp/
                    ssh -i ${env.SSH_KEY_PATH} root@${env.NODE_IP} 'docker load -i /tmp/brawl-game-latest.tar'
                    """
                }
            }
        }

        stage('Deploy via Docker Swarm') {
            steps {
                script {
                    sh """
                    ssh -i ${env.SSH_KEY_PATH} root@${env.NODE_IP} 'test -f ${DOCKER_COMPOSE_FILE} || echo "File not found: ${DOCKER_COMPOSE_FILE}" && exit 1'
                    """

                    sh """
                    ssh -i ${env.SSH_KEY_PATH} root@${env.NODE_IP} 'docker stack deploy -c ${DOCKER_COMPOSE_FILE} ${STACK_NAME}'
                    """
                }
            }
        }

        stage('Clean Up Docker Images on Node') {
            steps {
                script {
                    sh """
                    ssh -i ${env.SSH_KEY_PATH} root@${env.NODE_IP} 'docker image prune -f'
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
