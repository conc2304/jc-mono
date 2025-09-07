#!/bin/bash

# =============================================================================
# Simple Media Optimizer for Cloudflare Upload - Bash 3.2 Compatible
# Optimizes ALL media files in a directory regardless of name or extension
# =============================================================================

# Global variables for ImageMagick commands
CONVERT_CMD=""
IDENTIFY_CMD=""

# Debug function to ensure script is running
debug_start() {
    echo "🚀 Media Optimizer Starting... v5"
    echo "Script path: $0"
    echo "Arguments: $@"
    echo "Current directory: $(pwd)"
    echo "Input directory: ${1:-.}"
    echo "Output directory: ${2:-optimized}"
    echo ""
}

# Check if required tools are available
check_tools() {
    local missing=()

    if ! command -v convert >/dev/null 2>&1; then
        missing+=("ImageMagick (convert)")
    fi

    if ! command -v ffmpeg >/dev/null 2>&1; then
        missing+=("FFmpeg")
    fi

    if ! command -v bc >/dev/null 2>&1; then
        missing+=("bc")
    fi

    if [ ${#missing[@]} -ne 0 ]; then
        echo "❌ Missing required tools: ${missing[*]}"
        echo ""
        echo "Install with:"
        echo "  macOS: brew install imagemagick ffmpeg bc"
        echo "  Ubuntu: sudo apt install imagemagick ffmpeg bc"
        echo ""
        return 1
    fi

    echo "✅ All required tools available"
    return 0
}

# Get file size in bytes (cross-platform)
get_file_size() {
    local file="$1"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        stat -f%z "$file" 2>/dev/null
    else
        stat -c%s "$file" 2>/dev/null
    fi
}

# Format bytes to human readable
format_bytes() {
    local bytes=$1
    if command -v numfmt >/dev/null 2>&1; then
        numfmt --to=iec "$bytes"
    else
        if [ "$bytes" -gt 1073741824 ]; then
            echo "$(echo "scale=1; $bytes/1073741824" | bc)GB"
        elif [ "$bytes" -gt 1048576 ]; then
            echo "$(echo "scale=1; $bytes/1048576" | bc)MB"
        elif [ "$bytes" -gt 1024 ]; then
            echo "$(echo "scale=1; $bytes/1024" | bc)KB"
        else
            echo "${bytes}B"
        fi
    fi
}

# Calculate percentage reduction
calc_reduction() {
    local original=$1
    local new=$2
    if [ "$original" -gt 0 ]; then
        echo "scale=1; (1 - $new/$original) * 100" | bc
    else
        echo "0"
    fi
}

# Convert string to lowercase (Bash 3.2 compatible)
to_lowercase() {
    echo "$1" | tr '[:upper:]' '[:lower:]'
}

# List files that will be processed
list_media_files() {
    local input_dir="${1:-.}"
    local image_extensions=("jpg" "jpeg" "png" "gif" "bmp" "tiff" "tif" "webp" "psd" "svg")
    local video_extensions=("mp4" "mov" "avi" "mkv" "webm" "flv" "wmv" "m4v" "3gp")

    echo "📁 Scanning for media files in: $input_dir"
    echo ""

    local found_images=()
    local found_videos=()

    # Find images
    for ext in "${image_extensions[@]}"; do
        while IFS= read -r -d '' file; do
            found_images+=("$file")
        done < <(find "$input_dir" -maxdepth 1 -iname "*.${ext}" -print0 2>/dev/null)
    done

    # Find videos
    for ext in "${video_extensions[@]}"; do
        while IFS= read -r -d '' file; do
            found_videos+=("$file")
        done < <(find "$input_dir" -maxdepth 1 -iname "*.${ext}" -print0 2>/dev/null)
    done

    if [ ${#found_images[@]} -eq 0 ] && [ ${#found_videos[@]} -eq 0 ]; then
        echo "❌ No media files found in: $input_dir"
        echo ""
        echo "Supported formats:"
        echo "  Images: ${image_extensions[*]}"
        echo "  Videos: ${video_extensions[*]}"
        echo ""
        echo "Files in directory:"
        ls -la "$input_dir" 2>/dev/null || echo "Directory not accessible"
        return 1
    fi

    echo "Found media files:"
    if [ ${#found_images[@]} -gt 0 ]; then
        echo "  📸 Images (${#found_images[@]}):"
        printf '    %s\n' "${found_images[@]}"
    fi

    if [ ${#found_videos[@]} -gt 0 ]; then
        echo "  🎥 Videos (${#found_videos[@]}):"
        printf '    %s\n' "${found_videos[@]}"
    fi

    echo ""
    return 0
}

# Optimize image files
optimize_image() {
    local input_file="$1"
    local output_dir="$2"
    local filename=$(basename "$input_file")
    local extension="${filename##*.}"
    local basename="${filename%.*}"
    local original_size=$(get_file_size "$input_file")

    echo "Processing image: $filename ($(format_bytes $original_size))"

    # Convert extension to lowercase for comparison
    local ext_lower=$(to_lowercase "$extension")

    case "$ext_lower" in
        png)
            # Check if PNG has transparency
            if convert "$input_file" -format "%A" info: | grep -q "True"; then
                echo "  PNG with transparency - optimizing as PNG"
                convert "$input_file" \
                    -strip \
                    -define png:compression-level=9 \
                    -resize '2048x2048>' \
                    "$output_dir/$filename"
            else
                echo "  PNG without transparency - converting to JPEG"
                convert "$input_file" \
                    -strip \
                    -quality 92 \
                    -resize '2048x2048>' \
                    "$output_dir/${basename}.jpg"
            fi
            ;;
        jpg|jpeg)
            echo "  Optimizing JPEG"
            convert "$input_file" \
                -strip \
                -quality 92 \
                -resize '2048x2048>' \
                "$output_dir/$filename"
            ;;
        gif)
            # Check if animated GIF
            if [ "$(identify "$input_file" | wc -l)" -gt 1 ]; then
                echo "  Animated GIF - optimizing frames"
                convert "$input_file" \
                    -coalesce \
                    -layers OptimizeFrame \
                    -resize '1024x1024>' \
                    "$output_dir/$filename"
            else
                echo "  Static GIF - converting to JPEG"
                convert "$input_file" \
                    -strip \
                    -quality 92 \
                    -resize '2048x2048>' \
                    "$output_dir/${basename}.jpg"
            fi
            ;;
        webp)
            echo "  Converting WebP to JPEG"
            convert "$input_file" \
                -strip \
                -quality 92 \
                -resize '2048x2048>' \
                "$output_dir/${basename}.jpg"
            ;;
        tiff|tif|bmp|psd)
            echo "  Converting $extension to JPEG"
            convert "$input_file" \
                -strip \
                -quality 92 \
                -resize '2048x2048>' \
                "$output_dir/${basename}.jpg"
            ;;
        svg)
            echo "  Copying SVG (vector format)"
            cp "$input_file" "$output_dir/$filename"
            ;;
        *)
            echo "  Unknown image format: $extension - copying as-is"
            cp "$input_file" "$output_dir/$filename"
            ;;
    esac

    # Calculate and report savings
    local output_files=("$output_dir/${basename}".{jpg,png,gif,webp,svg})
    for output_file in "${output_files[@]}"; do
        if [ -f "$output_file" ]; then
            local new_size=$(get_file_size "$output_file")
            local reduction=$(calc_reduction "$original_size" "$new_size")
            echo "  → $(basename "$output_file") ($(format_bytes $new_size)) - ${reduction}% reduction"
            break
        fi
    done
}

# Optimize video files
optimize_video() {
    local input_file="$1"
    local output_dir="$2"
    local filename=$(basename "$input_file")
    local extension="${filename##*.}"
    local basename="${filename%.*}"
    local original_size=$(get_file_size "$input_file")

    echo "Processing video: $filename ($(format_bytes $original_size))"

    # Determine optimization settings based on file size
    local crf=23
    local max_width=1920
    local max_height=1080

    # Use higher compression for larger files
    if [ "$original_size" -gt 52428800 ]; then  # > 50MB
        crf=25
        max_width=1600
        max_height=900
        echo "  Large file detected - using higher compression"
    fi

    echo "  Optimizing video (CRF: $crf, Max: ${max_width}x${max_height})"

    ffmpeg -i "$input_file" \
        -c:v libx264 \
        -crf "$crf" \
        -preset medium \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -vf "scale='min($max_width,iw)':'min($max_height,ih)':force_original_aspect_ratio=decrease" \
        -avoid_negative_ts make_zero \
        "$output_dir/${basename}_optimized.mp4" \
        -y >/dev/null 2>&1

    if [ -f "$output_dir/${basename}_optimized.mp4" ]; then
        local new_size=$(get_file_size "$output_dir/${basename}_optimized.mp4")
        local reduction=$(calc_reduction "$original_size" "$new_size")
        echo "  → ${basename}_optimized.mp4 ($(format_bytes $new_size)) - ${reduction}% reduction"
    else
        echo "  Video optimization failed - copying original"
        cp "$input_file" "$output_dir/$filename"
    fi
}

# Main optimization function
optimize_all_media() {
    local input_dir="${1:-.}"
    local output_dir="${2:-optimized}"

    # Validate input directory
    if [ ! -d "$input_dir" ]; then
        echo "Error: Input directory does not exist: $input_dir"
        return 1
    fi

    # Create output directory
    mkdir -p "$output_dir"

    echo "Starting media optimization..."
    echo "Input: $(realpath "$input_dir")"
    echo "Output: $(realpath "$output_dir")"
    echo "======================================"

    # Define supported file extensions
    local image_extensions=("jpg" "jpeg" "png" "gif" "bmp" "tiff" "tif" "webp" "psd" "svg")
    local video_extensions=("mp4" "mov" "avi" "mkv" "webm" "flv" "wmv" "m4v" "3gp")

    # Process all image files
    echo ""
    echo "PROCESSING IMAGES"
    echo "--------------------------------"
    for ext in "${image_extensions[@]}"; do
        find "$input_dir" -maxdepth 1 -iname "*.${ext}" | while read -r file; do
            optimize_image "$file" "$output_dir"
        done
    done

    # Process all video files
    echo ""
    echo "PROCESSING VIDEOS"
    echo "--------------------------------"
    for ext in "${video_extensions[@]}"; do
        find "$input_dir" -maxdepth 1 -iname "*.${ext}" | while read -r file; do
            optimize_video "$file" "$output_dir"
        done
    done

    # Calculate total savings
    echo ""
    echo "OPTIMIZATION SUMMARY"
    echo "======================================"

    local original_total=0
    local optimized_total=0

    # Calculate original total - use simple approach without complex syntax
    for ext in "${image_extensions[@]}" "${video_extensions[@]}"; do
        # Check lowercase extension
        for file in "$input_dir"/*."$ext"; do
            if [ -f "$file" ]; then
                local size=$(get_file_size "$file")
                original_total=$((original_total + size))
            fi
        done
        # Check uppercase extension
        local ext_upper=$(echo "$ext" | tr '[:lower:]' '[:upper:]')
        for file in "$input_dir"/*."$ext_upper"; do
            if [ -f "$file" ]; then
                local size=$(get_file_size "$file")
                original_total=$((original_total + size))
            fi
        done
    done

    # Calculate optimized total
    for file in "$output_dir"/*; do
        if [ -f "$file" ]; then
            local size=$(get_file_size "$file")
            optimized_total=$((optimized_total + size))
        fi
    done

    if [ "$original_total" -gt 0 ]; then
        local total_reduction=$(calc_reduction "$original_total" "$optimized_total")
        echo "Original total: $(format_bytes $original_total)"
        echo "Optimized total: $(format_bytes $optimized_total)"
        echo "Total reduction: ${total_reduction}%"
        echo "Space saved: $(format_bytes $((original_total - optimized_total)))"
    fi

    echo ""
    echo "✅ Optimization complete! Files ready for Cloudflare upload."
    echo "📁 Upload location: $output_dir"
}

# Show usage
show_usage() {
    echo "Simple Media Optimizer for Cloudflare"
    echo "====================================="
    echo ""
    echo "Usage:"
    echo "  $0 [input_directory] [output_directory]"
    echo ""
    echo "Examples:"
    echo "  $0                           # Optimize current directory → 'optimized'"
    echo "  $0 ./media                   # Optimize ./media → 'optimized'"
    echo "  $0 ./photos ./web-ready      # Optimize ./photos → ./web-ready"
    echo ""
    echo "Supported formats:"
    echo "  Images: JPG, PNG, GIF, BMP, TIFF, WebP, PSD, SVG"
    echo "  Videos: MP4, MOV, AVI, MKV, WebM, FLV, WMV, M4V, 3GP"
    echo ""
    echo "Requirements:"
    echo "  • ImageMagick (for images): brew install imagemagick"
    echo "  • FFmpeg (for videos): brew install ffmpeg"
    echo "  • bc (for calculations): brew install bc"
}

# Main execution with debugging
main() {
    debug_start "$@"

    # Check tools first
    if ! check_tools; then
        exit 1
    fi

    # List files to be processed
    if ! list_media_files "$1"; then
        exit 1
    fi

    # Ask for confirmation
    echo -n "Continue with optimization? (y/N): "
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Optimization cancelled."
        exit 0
    fi

    # Run optimization
    optimize_all_media "$1" "$2"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-}" in
        -h|--help|help)
            show_usage
            ;;
        *)
            main "$@"
            ;;
    esac
else
    echo "Script sourced - functions available but not executing"
fi
