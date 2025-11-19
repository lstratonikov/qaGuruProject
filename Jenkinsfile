pipeline {
    agent {
        label 'ubuntu-latest' || 'any'
    }

    triggers {
        githubPush()
        pollSCM('* * * * *') 
    }

    environment {
        BASE_URL_API = credentials('BASE_URL_API')
        BASE_URL_UI = credentials('BASE_URL_UI')
        TELEGRAM_BOT_TOKEN = credentials('TELEGRAM_BOT_TOKEN')
        TELEGRAM_CHAT_ID = credentials('TELEGRAM_CHAT_ID')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/your-repo/your-project.git',
                credentialsId: 'github-credentials'
            }
        }

        stage('Setup Node.js') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS') {
                    sh 'npm ci'
                    sh 'npm exec playwright install --with-deps'
                }
            }
        }

        stage('Create .env') {
            steps {
                sh """
                    echo "BASE_URL_API=${BASE_URL_API}" >> .env
                    echo "BASE_URL_UI=${BASE_URL_UI}" >> .env
                """
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx playwright test'
            }
            post {
                always {
                    junit 'test-results/**/*.xml'
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh 'npx allure-commandline generate ./allure-results -o ./allure-report --clean'
                archiveArtifacts artifacts: 'allure-report/**/*', fingerprint: true
            }
        }

        stage('Send Telegram Notification') {
            steps {
                sh """
                    sed -e "s/%%TELEGRAM_BOT_TOKEN%%/${TELEGRAM_BOT_TOKEN}/g" \
                    -e "s/%%TELEGRAM_CHAT_ID%%/${TELEGRAM_CHAT_ID}/g" \
                    notifications/telegram.template.json > notifications/telegram.json
                    
                    java -DconfigFile=notifications/telegram.json -jar notifications/allure-notifications-4.11.0.jar
                """
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}