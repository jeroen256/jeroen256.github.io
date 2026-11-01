# python -m http.server
# docker build -t opencode-sandbox .
# docker run --rm -it -v $(pwd):/workspace opencode-sandbox
# npm init -y
# npm install --save-dev @playwright/test
# npx playwright install chromium
# npx http-server -p 8000
# docker exec -it cb41a977d237 bash
# node test-password-generator.js 8000
# node simple-test.js 8000 
FROM node:20-slim
WORKDIR /workspace
RUN apt-get update && apt-get install -y git curl
# Install Playwright system dependencies if doing browser testing
RUN npx playwright install-deps chromium || true
CMD ["bash"]