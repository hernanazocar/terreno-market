-- Seed con Inmobiliaria Chicureo (primer tenant)

-- Insertar Inmobiliaria Chicureo
INSERT INTO tenants (id, name, slug, primary_color, contact_email, contact_phone, subscription_tier, is_verified)
VALUES (
  'b0a1c2d3-e4f5-6789-0abc-def123456789',
  'Inmobiliaria Chicureo',
  'chicureo',
  '#c9a96e',
  'ventas@inmobiliariachicureo.cl',
  '+56912345678',
  'premium',
  true
);

-- Insertar proyecto de prueba: Hacienda Las Higueras
INSERT INTO projects (id, tenant_id, name, slug, description, commune, region, location_lat, location_lng, amenities, status)
VALUES (
  '11111111-2222-3333-4444-555555555555',
  'b0a1c2d3-e4f5-6789-0abc-def123456789',
  'Hacienda Las Higueras',
  'hacienda-las-higueras',
  'Exclusivo proyecto de parcelas de agrado en Chicureo. Entorno natural privilegiado con cercanía a colegios, centros comerciales y acceso directo a Ruta 5.',
  'Colina',
  'Región Metropolitana',
  -33.1734,
  -70.6486,
  '["Portón de acceso", "Caminos interiores", "Áreas verdes", "Vigilancia 24/7", "Red de agua potable", "Electricidad subterránea"]'::jsonb,
  'active'
);

-- Insertar términos de financiamiento para Las Higueras
INSERT INTO financing_terms (project_id, min_down_payment_pct, monthly_interest_rate, max_term_months, amortization_type, notes)
VALUES (
  '11111111-2222-3333-4444-555555555555',
  20.0,
  0.027,
  60,
  'french',
  'Crédito directo sin pie adicional. Tasa fija durante todo el plazo.'
);

-- Insertar parcelas de muestra
INSERT INTO parcels (
  project_id,
  tenant_id,
  code,
  rol,
  surface_m2,
  price_uf,
  price_clp,
  status,
  water_source,
  water_details,
  electricity,
  internet,
  buildable_summary,
  max_construction_m2,
  max_houses,
  sag_conaf_restrictions,
  location_lat,
  location_lng,
  slope,
  is_verified,
  gallery
) VALUES
-- Parcela 1
(
  '11111111-2222-3333-4444-555555555555',
  'b0a1c2d3-e4f5-6789-0abc-def123456789',
  'HH-001',
  '123-4567-8',
  5000,
  3500,
  140000000,
  'available',
  'apr',
  'APR Chicureo con factibilidad inmediata. Empalme incluido.',
  'available',
  'fiber',
  'Parcela de agrado. Permitido construcción de hasta 2 viviendas unifamiliares. Coeficiente de constructibilidad 0.1.',
  500,
  2,
  'Área de protección de quebrada en sector norte (aprox 10% de la superficie). Requiere estudio de impacto ambiental para construcciones mayores a 300m².',
  -33.1734,
  -70.6486,
  'Pendiente suave (5-10%) orientación norte',
  true,
  '[
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200",
    "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=1200",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200"
  ]'::jsonb
),
-- Parcela 2
(
  '11111111-2222-3333-4444-555555555555',
  'b0a1c2d3-e4f5-6789-0abc-def123456789',
  'HH-002',
  '123-4567-9',
  8000,
  5200,
  208000000,
  'available',
  'well',
  'Pozo profundo existente con caudal de 2 lt/seg. Agua de excelente calidad.',
  'nearby',
  'signal',
  'Parcela de agrado premium. Permitido hasta 3 viviendas. Mayor superficie edificable por ubicación.',
  800,
  3,
  'Sin restricciones SAG/CONAF. Zona libre para construcción.',
  -33.1745,
  -70.6495,
  'Plana con vista panorámica a la cordillera',
  true,
  '[
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200"
  ]'::jsonb
),
-- Parcela 3
(
  '11111111-2222-3333-4444-555555555555',
  'b0a1c2d3-e4f5-6789-0abc-def123456789',
  'HH-003',
  '123-4568-0',
  3000,
  2400,
  96000000,
  'available',
  'apr',
  'Conexión a APR con medidor individual incluido.',
  'available',
  'fiber',
  'Parcela ideal para casa de fin de semana. Permitido 1 vivienda principal + 1 mediagua.',
  300,
  1,
  'Zona con presencia de flora nativa protegida. Se requiere mantener al menos 20% del terreno como área verde sin intervención.',
  -33.1720,
  -70.6470,
  'Leve pendiente sur (3-8%)',
  false,
  '[
    "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=1200"
  ]'::jsonb
),
-- Parcela 4 - Reservada (para mostrar diferentes estados)
(
  '11111111-2222-3333-4444-555555555555',
  'b0a1c2d3-e4f5-6789-0abc-def123456789',
  'HH-004',
  '123-4568-1',
  6000,
  4100,
  164000000,
  'reserved',
  'water_rights',
  'Derechos de agua inscritos (0.5 acciones). Fácil constitución de pozo.',
  'available',
  'fiber',
  'Parcela esquina con doble acceso. Permitido hasta 2 viviendas.',
  600,
  2,
  'Sin restricciones.',
  -33.1750,
  -70.6500,
  'Terreno plano con arboleda nativa',
  true,
  '[]'::jsonb
);

-- Insertar un usuario ejecutivo de Chicureo (requiere que exista en auth.users primero)
-- Por ahora solo la estructura, el usuario real se crea cuando alguien hace login
-- Esto es solo para reference del modelo
