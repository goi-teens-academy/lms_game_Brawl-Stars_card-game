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
                    docker build -t ${env.IMAGE_NAME} .
                    """
                }
            }
        }

        stage('Save and Distribute Image') {
            steps {
                script {
                    // Save the Docker image
                    sh "docker save -o ${env.IMAGE_FILE} ${env.IMAGE_NAME}"

                    // Load the image on other nodes
                    def nodes = ["node1_ip", "node2_ip", "node3_ip"]  // replace with actual node IPs
                    for (node in nodes) {
                        sh """
                        scp -i ${env.GIT_SSH_KEY} ${env.IMAGE_FILE} root@${node}:/tmp/
                        ssh -i ${env.GIT_SSH_KEY} root@${node} 'docker load -i /tmp/brawl-game-latest.tar'
                        """
                    }
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
