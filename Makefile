build:
	npm run build

deploy: build
	aws s3 sync dist s3://ethereum-transaction-toy.tokenmarket.net
