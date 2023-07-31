#!/bin/bash

# Set the names of the font files (replace 'font1', 'font2', etc. with actual font file names)
font_names=("ABCFavoritExtended-Light-Named.ttf" "ABCFavoritExtended-Regular-Named.ttf" "FAMAime-Bold.ttf")

# S3 bucket and region information
S3_BUCKET="testnet-fonts"
S3_REGION="us-east-2"

# Directory to store the downloaded font files
DOWNLOAD_DIR="fonts"

# Create the download directory if it doesn't exist
mkdir -p "$DOWNLOAD_DIR"

# Function to download a file from S3 using curl
download_from_s3() {
  local file_name="$1"
  local url="https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${file_name}"
  curl --silent --remote-name "$url"
}

# Loop through the font files and download each one
for font_name in "${font_names[@]}"; do
  echo "Downloading $font_name..."
  download_from_s3 "$font_name"
  mv "$font_name" "$DOWNLOAD_DIR/"
  echo "Downloaded and moved $font_name to $DOWNLOAD_DIR."
done

echo "All font files downloaded to $DOWNLOAD_DIR."
