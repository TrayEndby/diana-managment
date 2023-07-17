.PHONY: prod
prod:
	git pull
	npm install
	GENERATE_SOURCEMAP=false REACT_APP_API_SERVER="https://www.kyros.ai/api" REACT_APP_NOT_SECRET="m75jnbExnb0xzD7SffpMzZid5" npm run build
	tar czf build.tgz build

prod_csa:
	git pull
	npm install
	GENERATE_SOURCEMAP=false REACT_APP_API_SERVER="https://csa-program.kyros.ai/api" REACT_APP_NOT_SECRET="m75jnbExnb0xzD7SffpMzZid5" REACT_APP_BUILD_TARGET=CSA npm run build
	tar czf build_csa.tgz build

prod_staging:
	git pull
	npm install
	GENERATE_SOURCEMAP=false REACT_APP_API_SERVER="https://staging.www.kyros.ai/api" REACT_APP_NOT_SECRET="m75jnbExnb0xzD7SffpMzZid5" npm run build
	tar czf build.tgz build

.PHONY: vm
vm:
	git pull
	npm install
	npm run build
	tar czf build.tgz build

clean:
	rm -rf build
