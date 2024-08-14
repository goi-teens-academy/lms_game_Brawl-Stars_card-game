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
                        string(credentialsId: 'docker_access_token_teens', variable: 'dockerAccessToken'),
                        string(credentialsId: 'goiteens_jenkins_build_bot_api_key', variable: 'telegramNotifyChannelBotApiToken'),
                        string(credentialsId: 'goiteens_jenkins_build_chat_id', variable: 'telegramNotifyChannelChatId')
                    ]) {
                        env.dockerUsername = dockerUsername
                        env.dockerAccessToken = dockerAccessToken
                        env.SSH_KEY_PATH = "${SSH_KEY_PATH}"
                        env.telegramNotifyChannelBotApiToken = telegramNotifyChannelBotApiToken
                        env.telegramNotifyChannelChatId = telegramNotifyChannelChatId
                    }
                }
            }
        }

        stage('Setup texts') {
            steps {
                script {
                    def buildUrl = env.RUN_DISPLAY_URL
                    env.startBuildText = java.net.URLEncoder.encode("Build *${JOB_NAME}* started\n[Go to build](${buildUrl})", "UTF-8")
                    env.successBuildText = java.net.URLEncoder.encode("Build *${JOB_NAME}* finished SUCCESS.\nTime: TIME\n[Go to build](${buildUrl})", "UTF-8")
                    env.failedBuildText = java.net.URLEncoder.encode("Build *${JOB_NAME}* FAILED.\nTime: TIME\n[Go to build](${buildUrl})", "UTF-8")
                }
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    git branch: 'master', credentialsId: 'pasha-goitacad-ssh', url: 'git@github.com:goi-teens-academy/lms_game_Brawl-Stars_card-game.git'
                    sendTelegramChannelMessage(env.telegramNotifyChannelBotApiToken, env.telegramNotifyChannelChatId, env.startBuildText)
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
            script {
                cleanWs()
                def success = 'SUCCESS'.equals(currentBuild.currentResult)
                def messageToSend = success ? env.successBuildText : env.failedBuildText
                sendTelegramChannelMessage(env.telegramNotifyChannelBotApiToken, env.telegramNotifyChannelChatId, messageToSend)
            }
        }
    }
}
