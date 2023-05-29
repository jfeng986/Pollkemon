import { Migration } from '@mikro-orm/migrations';

export class Migration20230528151145 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "polls" add column "total_voted" int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "polls" drop column "total_voted";');
  }

}
