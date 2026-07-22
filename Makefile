.PHONY: up down schema seeds seed-curso seed-aluno seed-funcionario seed-produto seed-transacao seed-item-transacao reset build logs

# Sobe os containers
up:
	docker compose up -d

# Derruba os containers (mantém o volume)
down:
	docker compose down

# Aplica o schema.sql (dropa e recria o banco do zero)
# Para o container da API antes, porque ele mantém conexão aberta que impede o DROP DATABASE
schema:
	docker compose stop api
	docker cp database/schema/schema.sql etecash_db:/schema.sql
	docker exec -it etecash_db psql -U postgres -d postgres -f /schema.sql
	docker compose start api

# Roda todos os seeds, na ordem certa (por causa das FKs)
seeds: seed-curso seed-aluno seed-funcionario seed-produto seed-transacao seed-item-transacao

seed-curso:
	docker cp database/seed/curso.sql etecash_db:/curso.sql
	docker exec -it etecash_db psql -U postgres -d etecash -f /curso.sql

seed-aluno:
	docker cp database/seed/aluno.sql etecash_db:/aluno.sql
	docker exec -it etecash_db psql -U postgres -d etecash -f /aluno.sql

seed-funcionario:
	docker cp database/seed/funcionario.sql etecash_db:/funcionario.sql
	docker exec -it etecash_db psql -U postgres -d etecash -f /funcionario.sql

seed-produto:
	docker cp database/seed/produto.sql etecash_db:/produto.sql
	docker exec -it etecash_db psql -U postgres -d etecash -f /produto.sql

seed-transacao:
	docker cp database/seed/transacao.sql etecash_db:/transacao.sql
	docker exec -it etecash_db psql -U postgres -d etecash -f /transacao.sql

seed-item-transacao:
	docker cp database/seed/item_transacao.sql etecash_db:/item_transacao.sql
	docker exec -it etecash_db psql -U postgres -d etecash -f /item_transacao.sql

# Atalho: derruba tudo, sobe de novo, aplica schema + seeds
reset: down up schema seeds

# Ver logs da API em tempo real
logs:
	docker compose logs -f api