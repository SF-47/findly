using backend.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <summary>
    /// Supabase exposes every table in the public schema through its REST and Realtime APIs to
    /// anyone holding the anon key (which ships inside the mobile and admin apps). Enabling row
    /// level security with no policies closes that door: anon and authenticated clients see
    /// nothing, while the API keeps full access because it connects as the tables' owner.
    ///
    /// Also stops Supabase Realtime from broadcasting the Messages table.
    /// SQL only: the EF model does not change, so the model snapshot is untouched.
    /// </summary>
    [DbContext(typeof(AppDbContext))]
    [Migration("20261110120000_EnableRowLevelSecurity")]
    public partial class EnableRowLevelSecurity : Migration
    {
        private const string Tables =
            "ARRAY['Admins','Categories','FoundItems','LostItems','Matches','Messages','Notifications','Students','Universities','__EFMigrationsHistory']";

        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                $$"""
                DO $$
                DECLARE
                    t text;
                    owner_name name;
                    can_bypass boolean;
                BEGIN
                    SELECT rolsuper OR rolbypassrls INTO can_bypass FROM pg_roles WHERE rolname = current_user;

                    -- Refuse to run if the API's role would itself be blocked by RLS.
                    FOREACH t IN ARRAY {{Tables}} LOOP
                        SELECT tableowner INTO owner_name FROM pg_tables WHERE schemaname = 'public' AND tablename = t;
                        IF owner_name IS NOT NULL AND owner_name <> current_user AND NOT can_bypass THEN
                            RAISE EXCEPTION 'Not enabling RLS: public.% is owned by %, not by %. The API would lose access.', t, owner_name, current_user;
                        END IF;
                    END LOOP;

                    FOREACH t IN ARRAY {{Tables}} LOOP
                        IF to_regclass(format('public.%I', t)) IS NOT NULL THEN
                            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
                        END IF;
                    END LOOP;

                    IF EXISTS (
                        SELECT 1 FROM pg_publication_tables
                        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'Messages'
                    ) THEN
                        ALTER PUBLICATION supabase_realtime DROP TABLE public."Messages";
                    END IF;
                END $$;
                """
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Re-opens the tables to the anon key. The Realtime publication is deliberately not restored.
            migrationBuilder.Sql(
                $$"""
                DO $$
                DECLARE t text;
                BEGIN
                    FOREACH t IN ARRAY {{Tables}} LOOP
                        IF to_regclass(format('public.%I', t)) IS NOT NULL THEN
                            EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', t);
                        END IF;
                    END LOOP;
                END $$;
                """
            );
        }
    }
}
