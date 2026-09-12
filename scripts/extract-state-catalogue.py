"""Extract factual catalogue fields from saved web-tool page results.

Usage: python3 scripts/extract-state-catalogue.py /tmp/campuslens-state-source-pages.json
Only names, numerical facts and source locations are retained, not page/review prose.
Selections are editorial, not a purported official cross-discipline top-ten ranking.
"""
import json, re, sys
from pathlib import Path

SELECTIONS = {
 'Andhra Pradesh': [15,3,5,7,9,11,13,14,1,21],
 'Arunachal Pradesh': [1,2,3,7,9,12,13,22,23,24],
 'Assam': [5,4,7,8,9,12,13,14,15,22],
 'Bihar': [2,3,4,6,7,8,10,12,16,28],
 'Chhattisgarh': [2,3,4,8,10,11,16,18,24,27],
 'Goa': [1,2,5,6,7,9,10,11,14,15],
 'Gujarat': [1,2,3,4,6,7,8,10,12,16],
 'Haryana': [1,5,8,11,12,14,19,23,24,28],
 'Himachal Pradesh': [2,4,5,9,13,16,18,22,23,29],
 'Jharkhand': [1,2,4,5,6,8,9,10,12,14],
 'Karnataka': [1,2,4,5,6,8,9,10,11,15],
 'Kerala': [1,2,3,6,7,8,11,16,18,28],
 'Madhya Pradesh': [2,3,4,5,11,12,16,18,21,22],
 'Maharashtra': [3,4,5,7,9,11,14,15,23,28],
 'Manipur': [1,2,3,4,5,8,9,23,25,26],
 'Meghalaya': [1,3,5,6,7,9,10,11,14,20],
 'Mizoram': [1,2,3,4,5,6,7,9,11,14],
 'Nagaland': [1,2,3,5,6,7,8,10,11,24],
 'Odisha': [1,2,4,5,6,8,9,18,22,27],
 'Punjab': [3,5,7,12,13,15,16,19,24,26],
 'Rajasthan': [2,4,6,7,9,10,15,18,23,29],
 'Sikkim': [1,2,3,4,5,6,9,10,11,17],
 'Tamil Nadu': [2,3,4,5,8,9,10,15,24,25],
 'Telangana': [1,2,4,6,7,10,11,16,22,30],
 'Tripura': [1,2,3,4,5,6,7,9,12,13],
 'Uttar Pradesh': [2,5,6,8,9,10,11,12,14,24],
 'Uttarakhand': [3,4,6,7,9,14,17,18,21,25],
 'West Bengal': [1,2,5,6,8,12,15,18,25,29],
}
# Explicit ownership choices, never inferred from missing source text.
PRIVATE = {
 'Andhra Pradesh':[9,11,13,14,21], 'Arunachal Pradesh':[9,12,13,22], 'Assam':[15],
 'Bihar':[4], 'Chhattisgarh':[27], 'Goa':[1,2,7,9,10,14],
 'Gujarat':[3,6,7,8,10], 'Haryana':[1,5,12,23,24,28], 'Himachal Pradesh':[16],
 'Jharkhand':[1,2,9,10], 'Karnataka':[4,8,9,11,15], 'Kerala':[3,6,7],
 'Madhya Pradesh':[18], 'Maharashtra':[3,7,15,28], 'Manipur':[], 'Meghalaya':[6,10,14],
 'Mizoram':[], 'Nagaland':[2,6,8,24], 'Odisha':[1,4,6], 'Punjab':[3,5,7,16,26],
 'Rajasthan':[2,9,10,18,23], 'Sikkim':[2,4,6,9,10], 'Tamil Nadu':[3,4,5,8,9,10,25],
 'Telangana':[2,4,7,11,22], 'Tripura':[1,7,9], 'Uttar Pradesh':[12],
 'Uttarakhand':[4,6,14,18], 'West Bengal':[5,6],
}

def classify(course):
    for pattern, discipline in [
      (r'Agricultur|B\.V\.Sc|Veterinary','Agriculture'),
      (r'Nursing|MBBS|BDS|B\.P\.T|B\.A\.M\.S|BAMS|^M\.D','Medicine'),
      (r'Pharm|B Pharma','Pharmacy'),
      (r'B\.Arch|M\.Arch|Planning','Architecture'),
      (r'L\.L|LLB|LLM|Law','Law'),
      (r'MBA|PGP|PGDM|BBA|IPM|EPGP|Management','Management'),
      (r'Tech|^BE\b|^ME\b|Engineering|Polytechnic','Engineering'),
      (r'B\.Com|M\.Com','Commerce'),
      (r'B\.Ed|M\.Ed|D\.El','Education'),
      (r'BCA|MCA','Computer Applications'),
      (r'B\.Sc|M\.Sc','Science')]:
        if re.search(pattern,course,re.I): return discipline
    return 'Arts'

def main():
    pages=json.loads(Path(sys.argv[1]).read_text())
    records=[]
    for state, orders in SELECTIONS.items():
        raw=pages[state]
        by_order={}
        for chunk in re.split(r'(?=L\d+: #\d+\s+\|)',raw):
            m=re.match(r'L\d+: #(\d+)\s+\|\s*cite(\d+)†([^]+)\s*([^|]+?)\s*\|',chunk)
            if not m: continue
            order=int(m[1])
            if order not in orders: continue
            fee=re.search(r'cite(\d+)†₹\s*([\d,]+)(.+?)- (Total Fees|1st Yr Fees|1st Year Fees|1st Sem Fees)',chunk)
            rating=re.search(r'(\d(?:\.\d+)?)\s*/\s*5 Based on ([\d,]+) UserReviews',chunk)
            avg=re.search(r'₹\s*([\d,]+)Average Package',chunk)
            location=m[4].split('Apply Now')[0].strip()
            if ', '+state not in location:
                raise ValueError('Wrong state: '+m[3]+' '+location)
            name=m[3].strip()
            city=location.split(', '+state)[0].strip()
            course=fee[3].strip() if fee else None
            refs=re.findall(r'cite(turn\d+(?:view|search)\d+)',raw[:raw.index(chunk)])
            ref=refs[-1] if refs else re.search(r'turn\d+(?:view|search)\d+',raw)[0]
            row=dict(name=name,city=city,state=state,ownership='PRIVATE' if order in PRIVATE[state] else 'PUBLIC',
              sourceOrder=order,sourceUrl='https://collegedunia.com/'+state.lower().replace(' ','-')+'-colleges',
              checkedAt='2026-09-12',course=course,discipline=classify(course or name),
              feeInr=int(fee[2].replace(',','')) if fee else None,feeBasis=fee[4] if fee else None,
              rating=float(rating[1]) if rating else None,ratingCount=int(rating[2].replace(',','')) if rating else None,
              ratingProvider='Collegedunia',averageSalaryInr=int(avg[1].replace(',','')) if avg else None,
              medianSalaryInr=None,medianSourceUrl=None,annualFeeInr=None,durationMonths=None,
              profileLink=int(m[2]),feeLink=int(fee[1]) if fee else None,ref=ref)
            if order not in by_order or row['rating'] is not None: by_order[order]=row
        for order in orders:
            if order not in by_order: raise ValueError(f'Missing {state} {order}')
            records.append(by_order[order])
    assert len(records)==280
    output=Path('data/catalogue/state-colleges.json');output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps(records,indent=2)+'\n')
    print(f'{len(records)} selected colleges; {sum(r["feeInr"] is not None for r in records)} published fees; {sum(r["rating"] is not None for r in records)} publisher ratings')

if __name__=='__main__': main()
