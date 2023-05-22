import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { UserSeeder } from "./UserSeeder.js";
import { TopicSeeder } from "./TopicSeeder.js";
import { PollSeeder } from "./PollSeeder.js";
import { PollOptioneeder } from "./PollOptionSeeder.js";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [
      UserSeeder,
      TopicSeeder,
      PollSeeder,
      PollOptioneeder,
    ]);
  }
}
