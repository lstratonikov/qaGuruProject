# Указываем ОС
FROM mcr.microsoft.com/playwright:v1.56.0-noble

# Копируем тесты
COPY . .

# Устанавливаем зависимости
RUN npm i
RUN npx playwright install --with-deps

CMD ["npm", "run", "test"]