
-- AlterTable
ALTER TABLE "SettlementTypes" ADD COLUMN     "slug" STRING;

-- AlterTable
ALTER TABLE "Settlements" RENAME COLUMN "title" TO "name";
ALTER TABLE "Settlements" ADD COLUMN     "slug" STRING;

-- Cannot use trigger because it's not yet implemented by Prisma.

-- CREATE EXTENSION IF NOT EXISTS "unaccent";

-- CREATE OR REPLACE FUNCTION slugify("value" TEXT)
-- RETURNS TEXT AS $$
--   WITH "unaccented" AS (
--     SELECT unaccent("value") AS "value"
--   ),
--   "lowercase" AS (
--     SELECT lower("value") AS "value"
--     FROM "unaccented"
--   ),
--   "removed_quotes" AS (
--     SELECT regexp_replace("value", '[''"]+', '', 'gi') AS "value"
--     FROM "lowercase"
--   ),
--   "hyphenated" AS (
--     SELECT regexp_replace("value", '[^a-z0-9\-_]+', '-', 'gi') AS "value"
--     FROM "removed_quotes"
--   ),
--   "trimmed" AS (
--     SELECT regexp_replace(regexp_replace("value", '\-+$', ''), '^\-', '') AS "value"
--     FROM "hyphenated"
--   )
--   SELECT "value" FROM "trimmed";
-- $$ LANGUAGE SQL STRICT IMMUTABLE;

-- CREATE OR REPLACE FUNCTION public.set_slug_from_name() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$

-- DECLARE
--   sql_string varchar;
--   tmp_slug varchar;
--   increment integer;
--   tmp_row record;
--   tmp_row_count integer;

-- BEGIN
--   tmp_row_count = 1;
--   increment = 0;
--   while tmp_row_count > 0 LOOP
    
--     if increment > 0 then
--       tmp_slug = slugify(NEW.name || ' ' || increment::varchar);
--     ELSE
--       tmp_slug = slugify(NEW.name);
--     end if;

--     sql_string = format(' select count(1) cnt from ' || TG_TABLE_NAME || ' where slug = ''' || tmp_slug || '''; ');
--     for tmp_row in  execute(sql_string)
--     loop
--       raise notice '%', tmp_row;  
--       tmp_row_count = tmp_row.cnt;  
--     end loop;

--   increment = increment + 1;
--   END LOOP;

--   NEW.slug := tmp_slug;
--   RETURN NEW;
-- END
-- $$;

-- CREATE TRIGGER "trg_slug_insert"
-- BEFORE INSERT ON "Settlements"
-- FOR EACH ROW
-- WHEN (NEW.name IS NOT NULL AND NEW.slug IS NULL)
-- EXECUTE PROCEDURE set_slug_from_name();

-- CREATE TRIGGER "trg_slug_insert"
-- BEFORE INSERT ON "SettlementTypes"
-- FOR EACH ROW
-- WHEN (NEW.name IS NOT NULL AND NEW.slug IS NULL)
-- EXECUTE PROCEDURE set_slug_from_name();
