if [ "$1" == "--dev" ]; then
    aws s3 sync dist/ s3://stage.testnet.renegade.fi --delete --exclude "*.sw[a-p]"
    aws cloudfront create-invalidation --distribution-id E3KVSGFA1XRH1R --paths "/*"
fi
if [ "$1" == "--prod" ]; then
    # aws s3 sync dist/ s3://testnet.renegade.fi --delete --exclude "*.sw[a-p]"
    # aws cloudfront create-invalidation --distribution-id E182E1ZLY7OQGA --paths "/*"
fi
