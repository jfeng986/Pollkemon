import { Migration } from "@mikro-orm/migrations";

export class Migration20230522015842 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "topics" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "topic_name" varchar(255) not null);'
    );

    this.addSql(
      'create table "users" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) not null, "voted_polls" text[] not null);'
    );
    this.addSql(
      'alter table "users" add constraint "users_email_unique" unique ("email");'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "topics" cascade;');

    this.addSql('drop table if exists "users" cascade;');
  }
}
