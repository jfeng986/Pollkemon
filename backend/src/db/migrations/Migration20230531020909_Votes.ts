import { Migration } from '@mikro-orm/migrations';

export class Migration20230531020909 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "topics" add column "votes" int not null;');

    this.addSql('alter table "polls" rename column "total_voted" to "votes";');

    this.addSql('alter table "poll_options" rename column "voted_num" to "votes";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "topics" drop column "votes";');

    this.addSql('alter table "polls" rename column "votes" to "total_voted";');

    this.addSql('alter table "poll_options" rename column "votes" to "voted_num";');
  }

}
