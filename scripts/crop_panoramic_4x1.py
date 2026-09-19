import sys
import os
from PIL import Image

def crop_to_4x1(input_path, output_path, target_width=1600, target_height=400, vertical_align='center'):
    """
    Crops an image to a strict 4:1 panoramic ratio, focusing on the right side for action.
    """
    if not os.path.exists(input_path):
        print(f"Error: {input_path} does not exist")
        return False
        
    img = Image.open(input_path).convert("RGB")
    orig_w, orig_h = img.size
    
    # Target aspect ratio is 4:1
    # We want target_h = orig_w / 4
    crop_h = int(orig_w / 4)
    
    if crop_h > orig_h:
        # If the image is taller than 4:1, we fit by height
        crop_w = orig_h * 4
        # Since action is on the right, crop from right: (orig_w - crop_w, 0, orig_w, orig_h)
        crop_box = (max(0, orig_w - crop_w), 0, orig_w, orig_h)
    else:
        # Image is 16:9, so crop_h is smaller than orig_h
        # Position vertically: slightly below center or center to capture tatami/mats and torso
        if vertical_align == 'center':
            top = (orig_h - crop_h) // 2
        elif vertical_align == 'top':
            top = int((orig_h - crop_h) * 0.3)
        elif vertical_align == 'bottom':
            top = int((orig_h - crop_h) * 0.7)
        else:
            top = (orig_h - crop_h) // 2
            
        bottom = top + crop_h
        crop_box = (0, top, orig_w, bottom)
        
    cropped = img.crop(crop_box)
    resized = cropped.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    resized.save(output_path, quality=95)
    print(f"Saved 4:1 panoramic image: {output_path} ({target_width}x{target_height})")
    return True

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python crop_panoramic_4x1.py <input_path> <output_path> [align]")
        sys.exit(1)
    align = sys.argv[3] if len(sys.argv) > 3 else 'center'
    crop_to_4x1(sys.argv[1], sys.argv[2], vertical_align=align)

