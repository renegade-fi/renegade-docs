if [ "$1" == "--dev" ]; then
    aws s3 sync dist/ s3://stage.renegade.fi --delete --exclude "*.sw[a-p]"
    aws cloudfront create-invalidation --distribution-id E3RX5XMPU6VE0H --paths "/*"
fi
if [ "$1" == "--prod" ]; then
    aws s3 sync dist/ s3://renegade.fi --delete --exclude "*.sw[a-p]"
    aws cloudfront create-invalidation --distribution-id E3BE7BTI0DFCZF --paths "/*"
fi
