@Library('jenkins-common')_

pipeline {
    agent {
        node {
            label 'goiteens'
        }
    }

    environment {
        IMAGE_NAME = "brawl-game"
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

        stage('Build and Tag Docker Image') {
            steps {
                script {
                    def dateTag = new Date().format("yyyyMMdd-HHmmss", TimeZone.getTimeZone('UTC'))
                    env.IMAGE_TAG = dateTag
                    sh """
                    docker build -t ${env.IMAGE_NAME}:${env.IMAGE_TAG} -t ${env.IMAGE_NAME}:latest .
                    """
                }
            }
        }

        stage('Save and Transfer Docker Image') {
            steps {
                script {
                    sh """
                    docker save -o /tmp/${env.IMAGE_NAME}-${env.IMAGE_TAG}.tar ${env.IMAGE_NAME}:${env.IMAGE_TAG}
                    scp -i ${env.SSH_KEY_PATH} /tmp/${env.IMAGE_NAME}-${env.IMAGE_TAG}.tar root@${env.REMOTE_NODE_IP}:/tmp/
                    ssh -i ${env.SSH_KEY_PATH} root@${env.REMOTE_NODE_IP} docker load -i /tmp/${env.IMAGE_NAME}-${env.IMAGE_TAG}.tar
                    """
                }
            }
        }

        stage('Deploy via Docker Swarm') {
            steps {
                script {
                    sh """
                    docker service update --image ${env.IMAGE_NAME}:${env.IMAGE_TAG} brawl-game_brawl-game --force
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
