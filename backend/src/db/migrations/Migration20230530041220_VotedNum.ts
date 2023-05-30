import { Migration } from '@mikro-orm/migrations';

export class Migration20230530041220 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "poll_options" add column "voted_num" int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "poll_options" drop column "voted_num";');
  }

}
