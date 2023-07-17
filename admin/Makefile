.PHONY: prod
prod:
	git pull
	npm install
	GENERATE_SOURCEMAP=false REACT_APP_API_SERVER="https://admin.kyros.ai/api" REACT_APP_NOT_SECRET="m75jnbExnb0xzD7SffpMzZid5" npm run build
	tar czf build.tgz build

clean:
	rm -rf build
