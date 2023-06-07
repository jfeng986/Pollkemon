import { Migration } from '@mikro-orm/migrations';

export class Migration20230522021435 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "polls" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "topic_id" int not null, "description" varchar(255) not null, "created_by_id" int not null, "is_permanent" boolean not null, "duration" int not null, "is_active" boolean not null, "allow_multiple" boolean not null);');

    this.addSql('alter table "polls" add constraint "polls_topic_id_foreign" foreign key ("topic_id") references "topics" ("id") on update cascade;');
    this.addSql('alter table "polls" add constraint "polls_created_by_id_foreign" foreign key ("created_by_id") references "users" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "polls" cascade;');
  }

}
