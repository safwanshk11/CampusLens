"""Find candidate NIRF matches and extract reported programme-cohort medians.

Does not silently accept fuzzy matches: candidates are saved for identity review.
Approved matches are read from data/catalogue/nirf-matches.json on --extract.
"""
import json, re, html, sys, subprocess
from pathlib import Path
from urllib.request import urlopen
from concurrent.futures import ThreadPoolExecutor
from difflib import SequenceMatcher

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'data/catalogue'
CACHE=Path('/tmp/campuslens-nirf');CACHE.mkdir(exist_ok=True)
CATEGORIES=['Overall','Engineering','Medical','Management','College','Law','Pharmacy','Agriculture','Architecture','University']

def normal(s):
    s=s.lower().replace('tiruchirappalli','trichy').replace('tiruchirapalli','trichy').replace('bengaluru','bangalore').replace('calicut','kozhikode').replace('allahabad','prayagraj')
    s=re.sub(r'\[[^]]*\]|\([^)]*\)','',s)
    return ' '.join(re.findall(r'[a-z0-9]+',s))

def ranking(category):
    page=urlopen(f'https://www.nirfindia.org/Rankings/2025/{category}Ranking.html',timeout=30).read().decode('utf-8-sig')
    page=re.sub(r'>\s+','>',re.sub(r'\s+<','<',page))
    result=[]
    for chunk in page.split('<tr><td>IR-')[1:]:
        name=re.search(r'</td><td>(.*?)<div',chunk)
        pdf=re.search(r'href="(https://[^\"]+\.pdf)"',chunk)
        loc=re.search(r'</div></td><td>(.*?)</td><td>(.*?)</td><td>[^<]+</td><td>(\d+)</td>',chunk)
        if name and pdf and loc: result.append(dict(name=html.unescape(name[1]),city=loc[1],state=loc[2],rank=int(loc[3]),category=category,url=pdf[1]))
    return result

def candidates():
    rows=json.loads((DATA/'state-colleges.json').read_text())
    with ThreadPoolExecutor(max_workers=4) as pool: sources=[r for group in pool.map(ranking,CATEGORIES) for r in group]
    (CACHE/'ranking-sources.json').write_text(json.dumps(sources))
    matches=[]
    for i,row in enumerate(rows):
        a=normal(row['name'])
        candidates=[]
        for s in sources:
            if s['state']!=row['state']: continue
            b=normal(s['name'])
            score=SequenceMatcher(None,a,b).ratio()
            if b in a: score=max(score,.96)
            # Acronyms such as NIT Trichy still need explicit manual review.
            if score>=.49: candidates.append(dict(**s,score=round(score,3)))
        candidates.sort(key=lambda x:x['score'],reverse=True)
        if candidates: matches.append(dict(index=i,name=row['name'],candidates=candidates[:5]))
    (DATA/'nirf-candidates.json').write_text(json.dumps(matches,indent=2)+'\n')
    for m in matches: print(m['index'],m['name'],'=>',m['candidates'][0]['name'],m['candidates'][0]['score'])

def extract_one(match):
    url=match['url']; dest=CACHE/(url.split('/')[-2]+'-'+url.split('/')[-1]);txt=dest.with_suffix('.txt')
    if not txt.exists():
        dest.write_bytes(urlopen(url,timeout=40).read())
        subprocess.run(['pdftotext','-layout',str(dest),str(txt)],check=True,capture_output=True)
    content=txt.read_text()
    found=[]
    for block in re.split(r'(?=(?:UG|PG)(?:-Integrated)? \[\d+ Years Program\(s\)\]: Placement)',content):
        title=re.match(r'((?:UG|PG)(?:-Integrated)? \[\d+ Years Program\(s\)\]): Placement',block)
        if not title: continue
        block=block.split('Ph.D Student Details')[0]
        for row in re.finditer(r'(20\d\d-\d\d)\s+(\d+)\s+(\d+)\s+(\d{4,9})\s*\(',block):
            year,graduates,placed,median=row.groups()
            if 0<int(median)<=100000000 and int(placed)<=int(graduates):
                found.append(dict(cohort=title[1],academicYear=year,year=int(year[:4])+1,medianSalaryInr=int(median),placedStudents=int(placed),graduatingStudents=int(graduates),sourceUrl=url))
    return dict(index=match['index'],sourceName=match['name'],reports=found)

if __name__=='__main__':
    if '--extract' in sys.argv:
        matches=json.loads((DATA/'nirf-matches.json').read_text())
        with ThreadPoolExecutor(max_workers=4) as pool: results=list(pool.map(extract_one,matches))
        (DATA/'nirf-medians.json').write_text(json.dumps(results,indent=2)+'\n')
        print(len(results),'matched institutions;',sum(bool(r['reports']) for r in results),'with parsed placement cohorts')
    else: candidates()
