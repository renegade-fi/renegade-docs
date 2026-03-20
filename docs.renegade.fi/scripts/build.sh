./scripts/download-fonts.sh testnet-fonts us-east-2 "FAMAime-Regular.woff2 FAMAime-Bold.woff2 ABCFavoritMono-Regular.ttf ABCFavoritExtendedVariable.woff2 ABCFavoritExpanded-Regular-Named.ttf ABCFavorit-Regular-Named.ttf ABCFavorit-Light-Named.ttf"

# Install Go and Python 3.13 (not available in Vercel's build image)
source ./scripts/install-build-deps.sh

#./scripts/generate-go-docs.sh

./scripts/generate-python-docs.sh

./scripts/generate-rust-docs.sh

./scripts/generate-ts-docs.sh

npm run build
