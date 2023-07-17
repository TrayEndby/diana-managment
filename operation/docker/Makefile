all: build

.PHONY: build
build:
	@make clean -C ../../frontend
	@make prod -C ../../frontend
	@echo "#######"
	@echo "Run 'make push' to deploy build.tgz to the google bucket."
	@echo "The frontend job will pick it up under a minute."

build_csa:
	@make clean -C ../../frontend
	@make prod_csa -C ../../frontend
	@echo "#######"
	@echo "Run 'make push_csa' to deploy build.tgz to the google bucket."
	@echo "The frontend job will pick it up under a minute."

build_staging:
	@make clean -C ../../frontend
	@make prod_staging -C ../../frontend
	@echo "#######"
	@echo "Run 'make push_staging' to deploy build.tgz to the google bucket."
	@echo "The frontend job will pick it up under a minute."

build_admin:
	@make clean -C ../../admin
	@make prod -C ../../admin
	@echo "#######"
	@echo "Run 'make push_admin' to deploy build.tgz to the google bucket."
	@echo "The frontend job will pick it up under a minute."

.PHONY: docker
docker:
	./build-docker-image.sh

push_docker:
	docker push us.gcr.io/kyros-arion/diana-nginx:1.0.0.alpha

.PHONY: push
push:
	gsutil cp ../../frontend/build.tgz gs://kyros-diana-frontend/build.tgz

.PHONY: push_csa
push_csa:
	gsutil cp ../../frontend/build_csa.tgz gs://kyros-csa-frontend/build.tgz

.PHONY: push_staging
push_staging:
	gsutil cp ../../frontend/build.tgz gs://kyros-admin-frontend/build-staging.tgz

.PHONY: push_admin
push_admin:
	gsutil cp ../../admin/build.tgz gs://kyros-admin-frontend/build-admin.tgz
