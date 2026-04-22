DO $$ BEGIN
 CREATE TYPE "public"."employment_type" AS ENUM('fulltime', 'contract', 'freelance');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."project_category" AS ENUM('web', 'api', 'mobile', 'oss');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."skill_category" AS ENUM('frontend', 'backend', 'database', 'devops', 'tools');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "about" (
	"id" serial PRIMARY KEY NOT NULL,
	"bio" text NOT NULL,
	"years_experience" integer DEFAULT 0 NOT NULL,
	"location" varchar(255) NOT NULL,
	"availability" varchar(255) DEFAULT 'Available for freelance' NOT NULL,
	"fun_facts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"profile_image_url" varchar(500),
	"stats" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"cover_image" varchar(500),
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"published_at" varchar(50),
	"read_time" integer DEFAULT 5 NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"company" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"start_date" varchar(50) NOT NULL,
	"end_date" varchar(50),
	"current" boolean DEFAULT false NOT NULL,
	"description" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"location" varchar(255) NOT NULL,
	"type" "employment_type" DEFAULT 'fulltime' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"tagline" text NOT NULL,
	"roles" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"cta_primary" varchar(100) DEFAULT 'Get in Touch' NOT NULL,
	"cta_primary_target" varchar(100) DEFAULT '#contact' NOT NULL,
	"cta_secondary" varchar(100) DEFAULT 'View Projects' NOT NULL,
	"cta_secondary_target" varchar(100) DEFAULT '#projects' NOT NULL,
	"resume_url" varchar(500),
	"avatar_url" varchar(500),
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"long_description" text,
	"thumbnail" varchar(500) NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tech_stack" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"category" "project_category" NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"live_url" varchar(500),
	"github_url" varchar(500),
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"icon" varchar(50) NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"highlighted" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_name" varchar(255) DEFAULT 'Developer Portfolio' NOT NULL,
	"site_title" varchar(255) DEFAULT 'Fullstack Developer Portfolio' NOT NULL,
	"site_description" text DEFAULT 'Fullstack developer specializing in modern web technologies' NOT NULL,
	"email" varchar(255) DEFAULT 'hello@example.com' NOT NULL,
	"phone" varchar(50),
	"location" varchar(255),
	"availability" varchar(255),
	"og_image" varchar(500),
	"favicon" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"category" "skill_category" NOT NULL,
	"icon" varchar(50) NOT NULL,
	"proficiency" integer DEFAULT 3 NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "skills_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "social_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" varchar(100) NOT NULL,
	"url" varchar(500) NOT NULL,
	"icon" varchar(50) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"avatar" varchar(500),
	"quote" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
