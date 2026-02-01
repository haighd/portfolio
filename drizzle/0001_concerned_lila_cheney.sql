ALTER TABLE "blog_posts" ALTER COLUMN "published_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "blog_posts" ALTER COLUMN "updated_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "experiences" ALTER COLUMN "start_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "experiences" ALTER COLUMN "end_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "now_content" ALTER COLUMN "last_updated" SET DATA TYPE timestamp;--> statement-breakpoint
CREATE UNIQUE INDEX "experiences_company_role_start_unique" ON "experiences" USING btree ("company","role","start_date");