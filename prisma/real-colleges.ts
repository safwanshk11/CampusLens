// Directory identities only; no inferred fees, rankings or admission cutoffs.
export const josaaSource = "https://josaa.admissions.nic.in/applicant/seatmatrix/instituteview.aspx";
export const aiimsSource = "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1943659";
const iits = `Bhubaneswar|Bhubaneswar|Odisha|iitbbs.ac.in
Bombay|Mumbai|Maharashtra|iitb.ac.in
Mandi|Mandi|Himachal Pradesh|iitmandi.ac.in
Delhi|New Delhi|Delhi|iitd.ac.in
Indore|Indore|Madhya Pradesh|iiti.ac.in
Kharagpur|Kharagpur|West Bengal|iitkgp.ac.in
Hyderabad|Sangareddy|Telangana|iith.ac.in
Jodhpur|Jodhpur|Rajasthan|iitj.ac.in
Kanpur|Kanpur|Uttar Pradesh|iitk.ac.in
Madras|Chennai|Tamil Nadu|iitm.ac.in
Gandhinagar|Gandhinagar|Gujarat|iitgn.ac.in
Patna|Patna|Bihar|iitp.ac.in
Roorkee|Roorkee|Uttarakhand|iitr.ac.in
(ISM) Dhanbad|Dhanbad|Jharkhand|iitism.ac.in
Ropar|Rupnagar|Punjab|iitrpr.ac.in
(BHU) Varanasi|Varanasi|Uttar Pradesh|iitbhu.ac.in
Guwahati|Guwahati|Assam|iitg.ac.in
Bhilai|Durg|Chhattisgarh|iitbhilai.ac.in
Goa|Ponda|Goa|iitgoa.ac.in
Palakkad|Palakkad|Kerala|iitpkd.ac.in
Tirupati|Tirupati|Andhra Pradesh|iittp.ac.in
Jammu|Jammu|Jammu and Kashmir|iitjammu.ac.in
Dharwad|Dharwad|Karnataka|iitdh.ac.in`;
const nits = `Dr. B R Ambedkar National Institute of Technology Jalandhar|Jalandhar|Punjab|nitj.ac.in
Malaviya National Institute of Technology Jaipur|Jaipur|Rajasthan|mnit.ac.in
Maulana Azad National Institute of Technology Bhopal|Bhopal|Madhya Pradesh|manit.ac.in
Motilal Nehru National Institute of Technology Allahabad|Prayagraj|Uttar Pradesh|mnnit.ac.in
National Institute of Technology Agartala|Agartala|Tripura|nita.ac.in
National Institute of Technology Calicut|Kozhikode|Kerala|nitc.ac.in
National Institute of Technology Delhi|New Delhi|Delhi|nitdelhi.ac.in
National Institute of Technology Durgapur|Durgapur|West Bengal|nitdgp.ac.in
National Institute of Technology Goa|Cuncolim|Goa|nitgoa.ac.in
National Institute of Technology Hamirpur|Hamirpur|Himachal Pradesh|nith.ac.in
National Institute of Technology Karnataka Surathkal|Mangaluru|Karnataka|nitk.ac.in
National Institute of Technology Meghalaya|Sohra|Meghalaya|nitm.ac.in
National Institute of Technology Nagaland|Chumukedima|Nagaland|nitnagaland.ac.in
National Institute of Technology Patna|Patna|Bihar|nitp.ac.in
National Institute of Technology Puducherry|Karaikal|Puducherry|nitpy.ac.in
National Institute of Technology Raipur|Raipur|Chhattisgarh|nitrr.ac.in
National Institute of Technology Sikkim|Ravangla|Sikkim|nitsikkim.ac.in
National Institute of Technology Arunachal Pradesh|Jote|Arunachal Pradesh|nitap.ac.in
National Institute of Technology Jamshedpur|Jamshedpur|Jharkhand|nitjsr.ac.in
National Institute of Technology Kurukshetra|Kurukshetra|Haryana|nitkkr.ac.in
National Institute of Technology Manipur|Imphal|Manipur|nitmanipur.ac.in
National Institute of Technology Mizoram|Aizawl|Mizoram|nitmz.ac.in
National Institute of Technology Rourkela|Rourkela|Odisha|nitrkl.ac.in
National Institute of Technology Silchar|Silchar|Assam|nits.ac.in
National Institute of Technology Srinagar|Srinagar|Jammu and Kashmir|nitsri.ac.in
National Institute of Technology Tiruchirappalli|Tiruchirappalli|Tamil Nadu|nitt.edu
National Institute of Technology Uttarakhand|Srinagar|Uttarakhand|nituk.ac.in
National Institute of Technology Warangal|Hanumakonda|Telangana|nitw.ac.in
Sardar Vallabhbhai National Institute of Technology Surat|Surat|Gujarat|svnit.ac.in
Visvesvaraya National Institute of Technology Nagpur|Nagpur|Maharashtra|vnit.ac.in
National Institute of Technology Andhra Pradesh|Tadepalligudem|Andhra Pradesh|nitandhra.ac.in`;
const aiims = `Mangalagiri|Andhra Pradesh
Guwahati|Assam
Patna|Bihar
Darbhanga|Bihar
Raipur|Chhattisgarh
Rajkot|Gujarat
Manethi (Rewari project)|Haryana
Bilaspur|Himachal Pradesh
Jammu|Jammu and Kashmir
Kashmir|Jammu and Kashmir
Deoghar|Jharkhand
Bhopal|Madhya Pradesh
Nagpur|Maharashtra
Bhubaneswar|Odisha
Bathinda|Punjab
Jodhpur|Rajasthan
Madurai|Tamil Nadu
Bibinagar|Telangana
Rae Bareli|Uttar Pradesh
Gorakhpur|Uttar Pradesh
Rishikesh|Uttarakhand
Kalyani|West Bengal`;
export const realColleges = [
  { name: "All India Institute of Medical Sciences New Delhi", city: "New Delhi", state: "Delhi", websiteUrl: "https://www.aiims.edu/", institutionGroup: "AIIMS", sourceUrl: "https://www.aiims.edu/" },
  ...iits.split("\n").map(row => { const [name, city, state, domain] = row.split("|"); return { name: `Indian Institute of Technology ${name}`, city, state, websiteUrl: `https://${domain}`, institutionGroup: "IIT", sourceUrl: josaaSource }; }),
  ...nits.split("\n").map(row => { const [name, city, state, domain] = row.split("|"); return { name, city, state, websiteUrl: `https://${domain}`, institutionGroup: "NIT", sourceUrl: josaaSource }; }),
  ...aiims.split("\n").map(row => { const [city, state] = row.split("|"); return { name: `All India Institute of Medical Sciences ${city}`, city, state, websiteUrl: null, institutionGroup: "AIIMS", sourceUrl: aiimsSource }; }),
];

export const privateColleges = `Manipal Academy of Higher Education|Manipal|Karnataka|DEEMED
Birla Institute of Technology and Science Pilani|Pilani|Rajasthan|DEEMED
Amrita Vishwa Vidyapeetham|Coimbatore|Tamil Nadu|DEEMED
SRM Institute of Science and Technology|Chennai|Tamil Nadu|DEEMED
Vellore Institute of Technology|Vellore|Tamil Nadu|DEEMED
Siksha O Anusandhan|Bhubaneswar|Odisha|DEEMED
Kalinga Institute of Industrial Technology|Bhubaneswar|Odisha|DEEMED
Chandigarh University|Mohali|Punjab|PRIVATE
Amity University|Gautam Budh Nagar|Uttar Pradesh|PRIVATE
Symbiosis International|Pune|Maharashtra|DEEMED
Koneru Lakshmaiah Education Foundation|Vaddeswaram|Andhra Pradesh|DEEMED
Thapar Institute of Engineering and Technology|Patiala|Punjab|DEEMED
Lovely Professional University|Phagwara|Punjab|PRIVATE
UPES|Dehradun|Uttarakhand|PRIVATE
International Institute of Information Technology Hyderabad|Hyderabad|Telangana|DEEMED
Shoolini University of Biotechnology and Management Sciences|Solan|Himachal Pradesh|PRIVATE`.split("\n").map(row => {
  const [name, city, state, ownership] = row.split("|");
  return { name, city, state, ownership: ownership as "PRIVATE" | "DEEMED", websiteUrl: null, institutionGroup: "Independent university", sourceUrl: "https://www.nirfindia.org/Rankings/2025/UniversityRanking.html" };
});
