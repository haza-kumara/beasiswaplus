insert into public.scholarship_requirements (scholarship_id, requirement_type, operator, value, is_required)
select id, 'required_document', '=', 'sktm', true
from public.scholarships where title = 'Bantuan Tanggap Finansial Yayasan X';