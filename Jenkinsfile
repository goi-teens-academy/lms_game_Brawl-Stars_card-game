pipeline {
    agent {
        node {
            label 'goiteens'
        }
    }

    environment {
        SERVER_IP = "80.211.249.97"
        SCRIPT_PATH = "/tmp/deploy_container.sh"
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
                        cd /root/lms_game_Brawl-Stars_card-game &&
                        docker build -t brawl_stars_card_game .
                    '
                    """
                }
            }
        }

        stage('Upload and Set Permissions for Script') {
            steps {
                script {
                    sh """
                    scp deploy_container.sh root@${SERVER_IP}:${SCRIPT_PATH}
                    ssh root@${SERVER_IP} 'chmod +x ${SCRIPT_PATH}'
                    """
                }
            }
        }

        stage('Execute Deployment Script on Remote Server') {
            steps {
                script {
                    sh """
                    ssh root@${SERVER_IP} '${SCRIPT_PATH}'
                    """
                }
            }
        }

        stage('Clean Up') {
            steps {
                script {
                    sh """
                    ssh root@${SERVER_IP} 'rm -f ${SCRIPT_PATH}'
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
