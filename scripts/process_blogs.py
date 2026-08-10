import json
import re
import os

def process_links(file_path):
    db = {}
    
    with open(file_path, 'r') as f:
        for line in f:
            url = line.strip()
            if not url or 'analyticsvidhya.com' not in url:
                continue
            
            # Skip non-article patterns
            if any(x in url for x in ['/author/', '/team/', '/member/', '/login/', '/category/']):
                continue
                
            # Extract Year
            year_match = re.search(r'/blog/([0-9]{4})/', url)
            if year_match:
                year = year_match.group(1)
            else:
                # Some articles don't have dates in slug but are in /articles/
                if '/articles/' in url:
                    year = "Featured"
                else:
                    continue
            
            # Extract Title from slug
            # e.g. https://www.analyticsvidhya.com/blog/2025/04/ai-agents-vs-apps/
            slug = url.rstrip('/').split('/')[-1]
            title = slug.replace('-', ' ').title()
            
            if year not in db:
                db[year] = []
            
            db[year].append({
                "title": title,
                "url": url,
                "description": f"Deep-dive into {title.lower()} within the {year} Research Repository."
            })
            
    return db

if __name__ == "__main__":
    # Dynamically resolve paths relative to the script location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    workspace_dir = os.path.dirname(script_dir)
    links_path = os.path.join(workspace_dir, "links.txt")
    # Emits JSON into public/ rather than a JS module into src/. As a static
    # import this catalog was ~2.9 MB of the bundle, pulled in by two home
    # screens; as a fetched file it is off the first-paint path entirely and is
    # garbage-collectable when the view that uses it unmounts.
    data_dir = os.path.join(workspace_dir, "public", "data")
    os.makedirs(data_dir, exist_ok=True)
    catalog_path = os.path.join(data_dir, "blog-catalog.json")
    preview_path = os.path.join(data_dir, "blog-preview.json")

    blog_db = process_links(links_path)

    # Sort years descending
    sorted_years = sorted(blog_db.keys(), reverse=True)
    final_db = {y: blog_db[y] for y in sorted_years}

    # Full archive — fetched only when the Research Repository view is opened.
    with open(catalog_path, 'w') as f:
        json.dump(final_db, f, separators=(',', ':'))

    # Tiny pre-sliced preview for FeatureHome, which shows at most 8 articles and
    # must never pull the full archive to do it.
    preview = [
        {**article, "year": year}
        for year, articles in final_db.items()
        for article in articles
    ][:12]
    with open(preview_path, 'w') as f:
        json.dump(preview, f, separators=(',', ':'))

    print(f"Successfully processed {sum(len(v) for v in blog_db.values())} articles into {catalog_path}")
    print(f"Wrote {len(preview)} preview articles into {preview_path}")
