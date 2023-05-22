import type { EntityManager, Dictionary } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { PollOption } from "../entities/PollOption.js";

export class PollOptioneeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    //poll 1
    context.poll_1_option_1 = em.create(PollOption, {
      Poll: context.poll1,
      option_name: "red",
      users: [context.user1, context.user2],
    });

    context.poll_1_option_2 = em.create(PollOption, {
      Poll: context.poll1,
      option_name: "blue",
      users: [context.user3, context.user4],
    });

    context.poll_1_option_3 = em.create(PollOption, {
      Poll: context.poll1,
      option_name: "green",
      users: [context.user5],
    });

    context.poll_1_option_4 = em.create(PollOption, {
      Poll: context.poll1,
      option_name: "yellow",
      users: [],
    });
    //poll 2

    context.poll_2_option_1 = em.create(PollOption, {
      Poll: context.poll2,
      option_name: "C++",
      users: [],
    });

    context.poll_2_option_2 = em.create(PollOption, {
      Poll: context.poll2,
      option_name: "Java",
      users: [],
    });

    context.poll_2_option_3 = em.create(PollOption, {
      Poll: context.poll2,
      option_name: "Python",
      users: [],
    });

    //poll 3
    context.poll_3_option_1 = em.create(PollOption, {
      Poll: context.poll3,
      option_name: "dog",
      users: [context.user1],
    });

    context.poll_3_option_2 = em.create(PollOption, {
      Poll: context.poll3,
      option_name: "cat",
      users: [context.user2, context.user3, context.user4, context.user5],
    });

    //poll 4
    context.poll_4_option_1 = em.create(PollOption, {
      Poll: context.poll4,
      option_name: "basketball",
      users: [
        context.user1,
        context.user2,
        context.user3,
        context.user4,
        context.user5,
      ],
    });

    context.poll_4_option_2 = em.create(PollOption, {
      Poll: context.poll4,
      option_name: "soccer",
      users: [],
    });

    //poll 5
    context.poll_5_option_1 = em.create(PollOption, {
      Poll: context.poll5,
      option_name: "Star Wars",
      users: [
        context.user1,
        context.user2,
        context.user3,
        context.user4,
        context.user5,
      ],
    });

    context.poll_5_option_2 = em.create(PollOption, {
      Poll: context.poll5,
      option_name: "Star Trek",
      users: [context.user1, context.user2, context.user3, context.user4],
    });

    context.poll_5_option_3 = em.create(PollOption, {
      Poll: context.poll5,
      option_name: "Stargate",
      users: [context.user1, context.user2, context.user3],
    });
  }
}
