update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
where email = 'ggwp@gmail.com';