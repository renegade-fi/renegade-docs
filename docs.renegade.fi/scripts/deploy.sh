if [ "$1" == "--dev" ]; then
    aws s3 sync build/ s3://stage.docs.renegade.fi --delete --exclude "*.sw[a-p]"
    aws cloudfront create-invalidation --distribution-id E3GLYPW5PRFJN1 --paths "/*"
fi
if [ "$1" == "--prod" ]; then
    aws s3 sync build/ s3://docs.renegade.fi --delete --exclude "*.sw[a-p]"
    aws cloudfront create-invalidation --distribution-id EK3HIC1153XLY --paths "/*"
fi
