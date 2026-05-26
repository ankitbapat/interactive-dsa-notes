import json
import os
import re

# -----------------------------
# CONFIG
# -----------------------------

OLD_JSON = "../../public/data/questions.json"
OUTPUT_JSON = "../../public/data/questions_final.json"

# root folder of cloned repo
REPO_ROOT = "https://github.com/ankitbapat/leetcode/tree/main"

# -----------------------------
# HELPERS
# -----------------------------

def read_md_file(category):
    """
    Example:
    category = 'Recursion'
    -> NOTES_Recursion.md
    """

    category_clean = (
        category.replace("&", "And")
        .replace(" ", "")
    )

    filename = f"NOTES_{category_clean}.md"

    for root, dirs, files in os.walk(REPO_ROOT):
        if filename in files:
            path = os.path.join(root, filename)

            with open(path, "r", encoding="utf-8") as f:
                return f.read()

    return None


def extract_section(md_text, title):
    """
    Extract markdown section under heading.
    """

    pattern = rf"##\s*{re.escape(title)}(.*?)(?=\n##|\Z)"

    match = re.search(
        pattern,
        md_text,
        re.DOTALL | re.IGNORECASE,
    )

    if match:
        return match.group(1).strip()

    return None


def clean_text(text):
    if not text:
        return None

    return text.strip()


# -----------------------------
# MAIN
# -----------------------------

with open(OLD_JSON, "r", encoding="utf-8") as f:
    old_data = json.load(f)

final_data = []

for item in old_data:

    category = item.get("category", "Other")
    topic = item.get("topic", "General")

    md_text = read_md_file(category)

    explanation = item.get("concept")

    input_data = None
    output_data = None
    time_explanation = None
    space_explanation = None

    if md_text:

        # OPTIONAL:
        # improve matching later using problem title

        input_data = extract_section(
            md_text,
            "Input"
        )

        output_data = extract_section(
            md_text,
            "Output"
        )

        time_explanation = extract_section(
            md_text,
            "Time Complexity"
        )

        space_explanation = extract_section(
            md_text,
            "Space Complexity"
        )

    new_item = {
        "category": category,
        "subcategory": topic,
        "problem": item.get("question"),

        "questionText": item.get(
            "questionText"
        ),

        "input": clean_text(input_data),

        "output": clean_text(output_data),

        "explanation": clean_text(
            explanation
        ),

        "codeSnippet": item.get("source"),

        "timeComplexity": item.get(
            "time"
        ),

        "spaceComplexity": item.get(
            "space"
        ),

        "timeComplexityExplanation":
            clean_text(time_explanation),

        "spaceComplexityExplanation":
            clean_text(space_explanation),

        "difficulty": item.get(
            "difficulty"
        ),

        "leetcodeUrl": item.get(
            "leetcodeUrl"
        ),

        "repoUrl": item.get("repoUrl")
    }

    final_data.append(new_item)

# -----------------------------
# WRITE OUTPUT
# -----------------------------

with open(
    OUTPUT_JSON,
    "w",
    encoding="utf-8"
) as f:
    json.dump(
        final_data,
        f,
        indent=2,
        ensure_ascii=False
    )

print(
    f"Generated {OUTPUT_JSON} with {len(final_data)} problems."
)