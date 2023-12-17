run:
	docker-compose up -d
	@echo "server start"
down:
	docker-compose down
	@echo "server down"
lint:
	npm run lint
formatter:
	npm run prettier