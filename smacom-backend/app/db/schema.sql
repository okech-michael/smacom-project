-- ============================================================
-- SMACOM SOLUTIONS — Database Schema
-- Supabase PostgreSQL
-- ============================================================

-- USERS
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  phone text,
  full_name text not null,
  organisation text,
  role text not null check (role in ('producer', 'processor', 'farmer', 'learner', 'admin')),
  status text not null default 'pending' check (status in ('pending', 'verified', 'suspended')),
  subscription_plan text default 'free' check (subscription_plan in ('free', 'premium')),
  subscription_expires_at timestamptz,
  credits_balance numeric default 0,
  eco_badge text default 'bronze',
  facility_location point,
  fcm_token text,
  totp_secret text,
  totp_enabled boolean default false,
  id_document_path text,
  created_at timestamptz default now()
);

-- WASTE COLLECTION REQUESTS
create table waste_requests (
  id uuid primary key default gen_random_uuid(),
  producer_id uuid references users(id),
  waste_category text not null,
  waste_subtype text not null,
  additional_notes text,
  quantity_kg numeric not null,
  location_lat numeric not null,
  location_lng numeric not null,
  location_address text,
  disposal_fee numeric not null,
  status text default 'pending' check (status in ('pending', 'assigned', 'en_route', 'collected', 'cancelled')),
  processor_id uuid references users(id),
  created_at timestamptz default now(),
  collected_at timestamptz
);

-- WASTE PHOTOS
create table waste_photos (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references waste_requests(id),
  storage_path text not null,
  uploaded_at timestamptz default now()
);

-- COMPOSTING / DIGESTER UNITS
create table processing_units (
  id uuid primary key default gen_random_uuid(),
  processor_id uuid references users(id),
  unit_name text not null,
  unit_type text not null check (unit_type in ('composter', 'digester')),
  location_lat numeric,
  location_lng numeric,
  status text default 'active' check (status in ('active', 'inactive', 'alert')),
  created_at timestamptz default now()
);

-- IOT SENSOR READINGS
create table iot_readings (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references processing_units(id),
  temperature_c numeric,
  moisture_pct numeric,
  co2_ppm numeric,
  fill_level_pct numeric,
  composting_stage text check (composting_stage in ('active', 'maturation', 'ready')),
  progress_pct numeric,
  recorded_at timestamptz default now()
);

-- IOT ALERTS
create table iot_alerts (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references processing_units(id),
  alert_type text not null,
  message text not null,
  resolved boolean default false,
  triggered_at timestamptz default now(),
  resolved_at timestamptz
);

-- WASTE INTAKE LOG
create table waste_intake_log (
  id uuid primary key default gen_random_uuid(),
  processor_id uuid references users(id),
  request_id uuid references waste_requests(id),
  unit_id uuid references processing_units(id),
  quantity_kg numeric not null,
  logged_at timestamptz default now()
);

-- INVENTORY
create table inventory (
  id uuid primary key default gen_random_uuid(),
  processor_id uuid references users(id),
  product_type text not null,
  quantity_mt numeric not null default 0,
  status text default 'processing' check (status in ('processing', 'ready_for_sale')),
  updated_at timestamptz default now()
);

-- MARKETPLACE PRODUCTS
create table products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references users(id),
  name text not null,
  category text not null check (category in ('fertiliser', 'packaging', 'feed', 'eco_products', 'other')),
  description text,
  price numeric not null,
  unit text not null,
  quantity_available numeric not null,
  quality_grade text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ORDERS
create table orders (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references users(id),
  status text default 'pending' check (status in ('pending', 'approved', 'in_transit', 'delivered', 'cancelled')),
  total_amount numeric not null,
  platform_commission numeric not null,
  seller_payout numeric not null,
  created_at timestamptz default now(),
  delivered_at timestamptz
);

-- ORDER ITEMS
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  product_id uuid references products(id),
  quantity numeric not null,
  unit_price numeric not null
);

-- PAYMENTS
create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  reference_id uuid,
  reference_type text check (reference_type in ('waste_request', 'order', 'subscription', 'course')),
  amount numeric not null,
  provider text not null check (provider in ('mpesa', 'flutterwave')),
  provider_reference text,
  status text default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz default now()
);

-- PAYOUTS
create table payouts (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references users(id),
  amount numeric not null,
  reason text,
  status text default 'pending' check (status in ('pending', 'disbursed', 'failed')),
  scheduled_at timestamptz,
  disbursed_at timestamptz
);

-- CREDITS LEDGER
create table credits_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  amount numeric not null,
  direction text check (direction in ('credit', 'debit')),
  reason text,
  created_at timestamptz default now()
);

-- SOIL TEST DATA
create table soil_tests (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references users(id),
  nitrogen numeric,
  phosphorus numeric,
  potassium numeric,
  ph_level numeric,
  crop_type text,
  submitted_at timestamptz default now()
);

-- COURSES
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  instructor_id uuid references users(id),
  duration_hours numeric,
  fee numeric not null,
  is_published boolean default false,
  created_at timestamptz default now()
);

-- COURSE MODULES
create table course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id),
  title text not null,
  video_url text,
  order_index integer,
  has_quiz boolean default false
);

-- ENROLMENTS
create table enrolments (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid references users(id),
  course_id uuid references courses(id),
  progress_pct numeric default 0,
  completed boolean default false,
  enrolled_at timestamptz default now(),
  completed_at timestamptz
);

-- CERTIFICATES
create table certificates (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid references users(id),
  course_id uuid references courses(id),
  issued_at timestamptz default now(),
  storage_path text
);

-- NOTIFICATIONS
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  title text not null,
  body text not null,
  type text,
  is_read boolean default false,
  linked_unit_id uuid,
  created_at timestamptz default now()
);

-- SYSTEM SETTINGS
create table system_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Default system settings
insert into system_settings (key, value) values
  ('credit_rate_per_kg', '1'),
  ('base_disposal_fee_per_kg', '5'),
  ('premium_plan_monthly_price', '999'),
  ('premium_plan_annual_price', '9999'),
  ('co2_conversion_factor', '0.44'),
  ('carbon_credit_factor', '0.85');

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table users enable row level security;
alter table waste_requests enable row level security;
alter table waste_photos enable row level security;
alter table processing_units enable row level security;
alter table iot_readings enable row level security;
alter table iot_alerts enable row level security;
alter table waste_intake_log enable row level security;
alter table inventory enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;
alter table payouts enable row level security;
alter table credits_ledger enable row level security;
alter table soil_tests enable row level security;
alter table courses enable row level security;
alter table course_modules enable row level security;
alter table enrolments enable row level security;
alter table certificates enable row level security;
alter table notifications enable row level security;

-- Users: each user can read/update their own row; admins see all
create policy "users_self_read" on users for select using (auth.uid() = id);
create policy "users_self_update" on users for update using (auth.uid() = id);

-- Waste requests: producer sees own; processor sees assigned; admin sees all
create policy "waste_requests_producer" on waste_requests for all using (auth.uid() = producer_id);
create policy "waste_requests_processor" on waste_requests for select using (auth.uid() = processor_id);

-- Notifications: user sees own only
create policy "notifications_owner" on notifications for all using (auth.uid() = user_id);

-- Payments: user sees own only
create policy "payments_owner" on payments for all using (auth.uid() = user_id);

-- Credits ledger: user sees own only
create policy "credits_owner" on credits_ledger for all using (auth.uid() = user_id);

-- Soil tests: farmer sees own
create policy "soil_tests_owner" on soil_tests for all using (auth.uid() = farmer_id);

-- Enrolments: learner sees own
create policy "enrolments_owner" on enrolments for all using (auth.uid() = learner_id);

-- Certificates: learner sees own
create policy "certificates_owner" on certificates for all using (auth.uid() = learner_id);

-- Processing units: processor sees own
create policy "units_owner" on processing_units for all using (auth.uid() = processor_id);

-- Products: public read, seller manages own
create policy "products_public_read" on products for select using (true);
create policy "products_seller_write" on products for all using (auth.uid() = seller_id);

-- Courses: published courses publicly readable
create policy "courses_public_read" on courses for select using (is_published = true);