"""Collect official NIRF evidence into a research file, never directly into production."""
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import urlopen, Request
from datetime import date
import json
import re

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://www.nirfindia.org/Rankings/2025/"
CATEGORIES = ["Overall", "University", "College", "Engineering", "Medical", "Management", "Law", "Pharmacy", "Dental", "Architecture", "Agriculture"]
STATES = "Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal".split("|")

class Rankings(HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.row = None
        self.cell = None
        self.rows = []
        self.skip = 0
    def handle_starttag(self, tag, attrs):
        if tag == "table": self.depth += 1
        if self.depth != 1: return
        if tag == "tr": self.row = []
        if tag == "td": self.cell = ""
        if tag == "div": self.skip += 1
    def handle_endtag(self, tag):
        if tag == "table":
            self.depth -= 1
            return
        if self.depth != 1: return
        if tag == "div": self.skip = max(0, self.skip - 1)
        if tag == "td" and self.cell is not None:
            self.row.append(re.sub(r"\s+", " ", self.cell).strip())
            self.cell = None
        if tag == "tr" and self.row:
            self.rows.append(self.row)
            self.row = None
    def handle_data(self, data):
        if self.depth == 1 and self.cell is not None and not self.skip:
            self.cell += data

def fetch(category):
    url = BASE + category + "Ranking.html"
    parser = Rankings()
    with urlopen(Request(url, headers={"User-Agent": "CampusLens research; source verification"}), timeout=45) as response:
        html = response.read().decode("utf-8-sig")
        parser.feed(html)
    results = []
    for row in parser.rows:
        if len(row) != 6 or not row[5].isdigit(): continue
        identity, name, city, state, score, rank = row
        if re.search(r"Indian Institute of Technology|All India Institute of Medical Sciences|\bAIIMS\b|\bIIT\b", name, re.I): continue
        if state not in STATES: continue
        results.append(dict(nirfId=re.sub(r"^IR-[A-Z]+-", "", identity), name=name, city=city, state=state,
                            evidence=dict(category=category, rank=int(rank), year=2025, sourceUrl=url)))
    for band in sorted(set(re.findall(r'href="(' + re.escape(category) + r'Ranking\d+\.html)"', html))):
        band_url = BASE + band
        band_parser = Rankings()
        with urlopen(band_url, timeout=45) as response:
            band_html = response.read().decode("utf-8-sig")
            band_parser.feed(band_html)
        label = re.search(r'Rank.band[^\d]*(\d+\s*-\s*\d+)', band_html, re.I)
        if not label: continue
        for row in band_parser.rows:
            if len(row) != 3: continue
            name, city, state = row
            if state not in STATES or re.search(r"Indian Institute of Technology|All India Institute of Medical Sciences|\bAIIMS\b|\bIIT\b", name, re.I): continue
            results.append(dict(nirfId=None, name=name, city=city, state=state, evidence=dict(category=category, rank=None, rankBand=label.group(1).replace(" ", ""), year=2025, sourceUrl=band_url)))
    return results

def main():
    colleges = {}
    with ThreadPoolExecutor(max_workers=3) as pool:
        for records in pool.map(fetch, CATEGORIES):
            for row in records:
                nirf_id = row.pop("nirfId")
                identity = re.sub(r"[^a-z0-9]", "", row["name"].lower()) + "|" + row["state"]
                evidence = row.pop("evidence")
                record = colleges.setdefault(identity, dict(**row, nirfId=nirf_id, candidateId=identity, rankings=[]))
                record["rankings"].append(evidence)
    selections = {}
    for state in STATES:
        candidates = [c for c in colleges.values() if c["state"] == state]
        # Round-robin disciplines; ranks are only compared inside the same category.
        selected = []
        used = set()
        for index in range(100):
            for category in ["Engineering", "Medical", "University", "College", "Management", "Law", "Pharmacy", "Agriculture", "Architecture", "Dental", "Overall"]:
                options = sorted([c for c in candidates if any(r["category"] == category for r in c["rankings"])], key=lambda c: next(r["rank"] if r["rank"] is not None else int(r["rankBand"].split("-")[0]) for r in c["rankings"] if r["category"] == category))
                if index < len(options) and options[index]["candidateId"] not in used and len(selected) < 10:
                    selected.append(options[index]); used.add(options[index]["candidateId"])
            if len(selected) == 10: break
        selections[state] = dict(selected=selected, remaining=max(0, 10-len(selected)))
    output = ROOT / "data/research/state-shortlist.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(dict(checkedAt=str(date.today()), status="research-only", methodology="Round-robin category leaders from NIRF 2025; not a combined ranking. Gaps require additional research.", states=selections), indent=2)+"\n")
    for state, value in selections.items():
        print(f"{state}: {len(value['selected'])}/10 ranking-supported candidates")
    print(f"Saved {output}")

if __name__ == "__main__": main()
