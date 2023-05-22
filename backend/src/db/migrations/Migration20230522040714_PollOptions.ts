import { Migration } from '@mikro-orm/migrations';

export class Migration20230522040714 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "poll_options" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "option_name" varchar(255) not null, "poll_id" int not null);');

    this.addSql('create table "poll_options_users" ("poll_option_id" int not null, "user_id" int not null, constraint "poll_options_users_pkey" primary key ("poll_option_id", "user_id"));');

    this.addSql('alter table "poll_options" add constraint "poll_options_poll_id_foreign" foreign key ("poll_id") references "polls" ("id") on update cascade;');

    this.addSql('alter table "poll_options_users" add constraint "poll_options_users_poll_option_id_foreign" foreign key ("poll_option_id") references "poll_options" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "poll_options_users" add constraint "poll_options_users_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "poll_options_users" drop constraint "poll_options_users_poll_option_id_foreign";');

    this.addSql('drop table if exists "poll_options" cascade;');

    this.addSql('drop table if exists "poll_options_users" cascade;');
  }

}
