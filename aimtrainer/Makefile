.PHONY: up-dev down-dev prisma-create-migration prisma-migrate-up prisma-generate prisma-seed prisma-studio

up-dev:
	docker-compose -f docker-compose.dev.yaml up -d

down-dev:
	docker-compose -f docker-compose.dev.yaml down

prisma-create-migration:
	npx prisma migrate dev --create-only

prisma-migrate-up:
	npx prisma migrate dev

prisma-generate:
	npx prisma generate

prisma-seed:
	npx prisma db seed

prisma-studio:
	npx prisma studio