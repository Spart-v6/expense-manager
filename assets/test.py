from pathlib import Path
import json

# Load the original Lottie JSON
file_path = "./user_2.json"
with open(file_path, "r", encoding="utf-8") as f:
    lottie_data = json.load(f)

# Function to rename layers and replace gradients with solid fills
def clean_lottie_layers(lottie_json):
    layers = lottie_json.get("layers", [])
    cleaned_layers = []
    fill_counter = 1

    for layer in layers:
        shapes = layer.get("shapes", [])
        modified = False

        for shape in shapes:
            if shape.get("ty") == "gr":  # Group of shapes
                for subshape in shape.get("it", []):
                    if subshape.get("ty") == "gf":  # Gradient fill
                        # Convert gradient to solid fill
                        subshape["ty"] = "fl"
                        subshape["nm"] = f"PrimaryFill{fill_counter}"
                        # Use the first color stop from gradient
                        gradient_colors = subshape.get("g", {}).get("k", {}).get("c", {}).get("k", [])
                        if gradient_colors:
                            subshape["c"] = {"a": 0, "k": gradient_colors[:3], "ix": 3}
                        else:
                            subshape["c"] = {"a": 0, "k": [0, 0, 0], "ix": 3}
                        subshape.pop("g", None)
                        fill_counter += 1
                        modified = True
                    elif subshape.get("ty") == "fl":  # Solid fill
                        subshape["nm"] = f"PrimaryFill{fill_counter}"
                        fill_counter += 1
                        modified = True

        if modified:
            cleaned_layers.append(layer)

    # Replace only with cleaned layers
    lottie_json["layers"] = cleaned_layers
    return lottie_json

# Clean the Lottie JSON
cleaned_lottie_data = clean_lottie_layers(lottie_data)

# Save the cleaned version
cleaned_path = "user_2_cleaned.json"
with open(cleaned_path, "w", encoding="utf-8") as f:
    json.dump(cleaned_lottie_data, f, indent=2)

cleaned_path
