./scripts/download-fonts.sh testnet-fonts us-east-2 "FAMAime-Regular.woff2 FAMAime-Bold.woff2 ABCFavoritMono-Regular.ttf ABCFavoritExtendedVariable.woff2 ABCFavoritExpanded-Regular-Named.ttf ABCFavorit-Regular-Named.ttf ABCFavorit-Light-Named.ttf"

./scripts/generate-ts-docs.sh

./scripts/generate-go-docs.sh

./scripts/generate-python-docs.sh

./scripts/generate-rust-docs.sh

npm run build
