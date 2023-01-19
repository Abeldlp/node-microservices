serve:
	docker-compose up -f ./node-api-gateway/docker-compose.yml -d
	docker-compose up -f ./node-auth/docker-compose.yml -d

down:
	docker-compose down -f ./node-api-gateway/docker-compose.yml -d
	docker-compose down -f ./node-auth/docker-compose.yml -d
