"""Merge observed fee durations and identity-reviewed NIRF medians into the import.

Run after extract-state-catalogue.py and enrich-nirf-medians.py --extract.
"""
import json,re,sys
from pathlib import Path

p=Path('data/catalogue/state-colleges.json')
rows=json.loads(p.read_text())
pages=json.loads(Path(sys.argv[1]).read_text())
for i,(row,page) in enumerate(zip(rows,pages)):
    row['courseSourceUrl']=None
    row['annualFeeBasis']=None
    if not page.startswith('Internal'):
        url=re.search(r'\((https://collegedunia\.com/[^\s]+)\)\n',page)
        if url: row['courseSourceUrl']=url[1]
        # Ignore comparison tables and user-generated/AI review summaries.
        head=re.split(r"Students' Opinion|### Compare|## Compare",page)[0]
        duration=re.search(r'duration\s*\|\s*([\d.]+)\s*(Years?|Months?)',head,re.I)
        if not duration:
            duration=re.search(r'\b([1-6](?:\.5)?)[- ]year (?:full.time|integrated|programme|program|professional|MBBS|B\.Tech|undergraduate|postgraduate|course|blended)',head,re.I)
        if not duration:
            duration=re.search(r'(?:is a|is an|offers a)\s+([\d.]+)[- ](years?|months?)',head,re.I)
        if duration:
            unit=duration[2] if duration.lastindex==2 else 'years'
            months=round(float(duration[1])*(1 if unit.lower().startswith('month') else 12))
            if 6<=months<=96: row['durationMonths']=months
        # Explicit annual tuition tables take precedence over calculations.
        tuition=re.search(r'(?:Annual Tuition Fee|Tuition Fee \(per year\)|Year 1 Tuition Fee)\s*\|\s*(?:INR|Rs\.?|₹)?\s*([\d,]+)',head,re.I)
        if tuition and 100<=int(tuition[1].replace(',',''))<=10000000:
            row['annualFeeInr']=int(tuition[1].replace(',',''))
            row['annualFeeBasis']='ANNUAL_TUITION'
    if row['annualFeeInr'] is None and row['feeBasis'] in ['1st Yr Fees','1st Year Fees']:
        row['annualFeeInr']=row['feeInr'];row['annualFeeBasis']='PUBLISHED_FIRST_YEAR'
    elif row['annualFeeInr'] is None and row['feeInr'] and row['feeBasis']=='Total Fees' and row['durationMonths']:
        row['annualFeeInr']=round(row['feeInr']*12/row['durationMonths'])
        row['annualFeeBasis']='ANNUALISED_TOTAL'
    for key in ['profileLink','feeLink','ref']: row.pop(key,None)

median_path=Path('data/catalogue/nirf-medians.json')
if median_path.exists():
    for entry in json.loads(median_path.read_text()):
        row=rows[entry['index']]
        reports=entry['reports']
        if not reports: continue
        # Use the latest available cohort, favour UG for an undergraduate reference.
        course=row['course'] or ''
        level='PG' if re.match(r'M\.|MBA|MCA|PG|EPG',course) else 'UG'
        preferred=[r for r in reports if r['cohort'].startswith(level)]
        chosen=max(preferred or reports,key=lambda r:r['year'])
        row.update(medianSalaryInr=chosen['medianSalaryInr'],medianSourceUrl=chosen['sourceUrl'],
                   medianYear=chosen['year'],medianCohort=f"{chosen['cohort']} · {chosen['academicYear']}")

p.write_text(json.dumps(rows,indent=2)+'\n')
print('Colleges:',len(rows),'annual figures:',sum(r['annualFeeInr'] is not None for r in rows),
      'median reports:',sum(r['medianSalaryInr'] is not None for r in rows),
      'average figures:',sum(r['averageSalaryInr'] is not None for r in rows),
      'ratings:',sum(r['rating'] is not None for r in rows))
