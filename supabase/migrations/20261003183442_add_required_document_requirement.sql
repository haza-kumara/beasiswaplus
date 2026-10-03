-- jalankan di SQL Editor Studio
select conname from pg_constraint
where conrelid = 'public.scholarship_requirements'::regclass and contype = 'c';