import json
import re

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
    links_path = "/Users/nandanpatkar/Downloads/genai-roadmap-src/links.txt"
    output_path = "/Users/nandanpatkar/Downloads/genai-roadmap-src/src/data/blogData.js"
    
    blog_db = process_links(links_path)
    
    # Sort years descending
    sorted_years = sorted(blog_db.keys(), reverse=True)
    final_db = {y: blog_db[y] for y in sorted_years}
    
    with open(output_path, 'w') as f:
        f.write("// Auto-generated chronological blog data\n")
        f.write(f"export const CHRONOLOGICAL_DB = {json.dumps(final_db, indent=2)};\n")
    
    print(f"Successfully processed {sum(len(v) for v in blog_db.values())} articles into {output_path}")
