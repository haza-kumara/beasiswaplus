insert into public.profiles
  (id, full_name, semester, gpa, monthly_household_income, first_generation, orphan_status)
select id, 'User Testing', 3, 3.50, 1000000, true, true
from auth.users where email = 'bayu@gmail.com';

select * from public.profiles;  