
ALTER TABLE public.leads
  ADD CONSTRAINT leads_name_len CHECK (char_length(name) BETWEEN 1 AND 120),
  ADD CONSTRAINT leads_email_len CHECK (char_length(email) BETWEEN 3 AND 200 AND email LIKE '%@%'),
  ADD CONSTRAINT leads_phone_len CHECK (phone IS NULL OR char_length(phone) <= 40),
  ADD CONSTRAINT leads_location_len CHECK (location IS NULL OR char_length(location) <= 120),
  ADD CONSTRAINT leads_message_len CHECK (message IS NULL OR char_length(message) <= 2000),
  ADD CONSTRAINT leads_guests_range CHECK (guests IS NULL OR (guests >= 0 AND guests <= 10000));
