#!/bin/bash

# Read the command-line arguments
S3_BUCKET="$1"
S3_REGION="$2"
FONT_NAMES="$3"

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

# Convert space-separated font names to an array
font_names=($FONT_NAMES)

# Loop through the font files and download each one
for font_name in "${font_names[@]}"; do
  echo "Downloading $font_name..."
  download_from_s3 "$font_name"
  mv "$font_name" "$DOWNLOAD_DIR/"
  echo "Downloaded and moved $font_name to $DOWNLOAD_DIR."
done

echo "All font files downloaded to $DOWNLOAD_DIR."
