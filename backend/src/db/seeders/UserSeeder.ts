import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User } from "../entities/User.js";

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(User, {
      username: "test01",
      email: "test01@email.com",
      password: "test01",
    });
  }
}
