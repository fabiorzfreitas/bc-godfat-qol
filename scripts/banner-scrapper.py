import requests
from bs4 import BeautifulSoup
import re
import sys
from pathlib import Path

def scrape_battle_cats_banner(url):
    try:
        # User-Agent helps avoid getting blocked
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"  [ERROR] Failed to fetch {url}: {e}", file=sys.stderr)
        return None

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 1. Title Extraction
    title_element = soup.select_one(".mw-page-title-main") or soup.find("h1")
    title = title_element.get_text(strip=True) if title_element else "Unknown Title"
    title = re.sub(r'\(.*?\)', '', title).replace("Copy only title (no namespace)", "").strip()

    # 2. Ubers/Legends
    unit_names = []
    for tr in soup.find_all("tr"):
        if "Unit" in tr.get_text():
            link = tr.find("td").find("a") if tr.find("td") else None
            if link:
                name = link.get_text(strip=True)
                if name:  # Only add if the name is not an empty string
                    unit_names.append(name)
                    
    # 3. Rares/Super Rares
    rares = []
    content_div = soup.select_one(".mw-parser-output")
    if content_div:
        links = content_div.select("b a")
        for link in links:
            href = link.get('href', '')
            if "Super_Rare_Cat" in href or "Rare_Cat" in href:
                r_name = link.get_text(strip=True)
                if r_name: # Safety check for rares as well
                    rares.append(r_name)

    all_units = list(dict.fromkeys(unit_names + (["// others"] + rares if rares else [])))
    
    # Debug message for console
    print(f"  [OK] Scraped: {title} ({len(all_units)} units)", file=sys.stderr)

    return {
        "title": title,
        "link": url,
        "units": all_units
    }

def main():
    # Setup Paths
    script_dir = Path(__file__).resolve().parent
    url_file = (script_dir / ".." / "godfat" / "urls.txt").resolve()
    output_file = (script_dir / ".." / "godfat" / "data" / "bannersRaw.ts").resolve()

    if not url_file.exists():
        print(f"CRITICAL: {url_file} not found.", file=sys.stderr)
        return

    # Load URLs
    with open(url_file, "r") as f:
        urls = [line.strip() for line in f if line.strip()]

    print(f"--- Starting Scrape of {len(urls)} URLs ---", file=sys.stderr)

    results = [scrape_battle_cats_banner(u) for u in urls]
    final_data = [r for r in results if r is not None]

    # --- Generate TypeScript Content ---
    output = []
    output.append('import { Banner } from "../Banners";\n')
    output.append('// Got from wiki with `scripts/banner-scraper.py` script;\n')
    output.append('const banners: Banner[] = [')

    for entry in final_data:
        output.append('  {')
        output.append(f'    title: "{entry["title"]}",')
        output.append(f'    link: "{entry["link"]}",')
        output.append('    units: [')
        for unit in entry["units"]:
            safe_unit = unit.replace('"', '\\"')
            output.append(f'      "{safe_unit}",')
        output.append('    ],')
        output.append('  },')

    output.append('];\n')
    output.append('export default banners;')

    # Write to file
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(output))

    print(f"--- Finished! Data written to: {output_file.name} ---", file=sys.stderr)

if __name__ == "__main__":
    main()

