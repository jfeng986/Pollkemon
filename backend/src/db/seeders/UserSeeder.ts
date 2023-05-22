import type { EntityManager, Dictionary } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User } from "../entities/User.js";
import bcrypt from "bcrypt";

export class UserSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const hashedPw = await bcrypt.hash("password", 10);

    context.user1 = em.create(User, {
      username: "test01",
      email: "test01@email.com",
      password: hashedPw,
      voted_polls: [1, 2, 3],
    });

    context.user2 = em.create(User, {
      username: "test02",
      email: "test02@email.com",
      password: hashedPw,
      voted_polls: [],
    });

    context.user3 = em.create(User, {
      username: "test03",
      email: "test03@email.com",
      password: hashedPw,
      voted_polls: [],
    });

    context.user4 = em.create(User, {
      username: "test04",
      email: "test04@email.com",
      password: hashedPw,
      voted_polls: [],
    });

    context.user5 = em.create(User, {
      username: "test05",
      email: "test05@email.com",
      password: hashedPw,
      voted_polls: [],
    });
  }
}
