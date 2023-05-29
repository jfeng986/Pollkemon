import { Dictionary, EntityManager, t } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Poll } from "../entities/Poll.js";

export class PollSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    context.poll1 = em.create(Poll, {
      title: "What is your favorite color?",
      description: "Please select your favorite color from the list below.",
      created_by: context.user1,
      is_permanent: true,
      duration: -1,
      is_active: true,
      allow_multiple: false,
      topic: context.topic_other,
      total_voted: 0,
    });

    context.poll2 = em.create(Poll, {
      title: "What is your favorite programming languege?",
      description: "Please select your favorite languege from the list below.",
      created_by: context.user1,
      is_permanent: true,
      duration: -1,
      is_active: true,
      allow_multiple: false,
      topic: context.topic_tech,
      total_voted: 0,
    });

    context.poll3 = em.create(Poll, {
      title: "What is your favorite animal?",
      description: "Please select your favorite animal from the list below.",
      created_by: context.user2,
      is_permanent: false,
      duration: 60,
      is_active: true,
      allow_multiple: false,
      topic: context.topic_other,
      total_voted: 0,
    });

    context.poll4 = em.create(Poll, {
      title: "What is your favorite sport?",
      description: "Please select your favorite sport from the list below.",
      created_by: context.user2,
      is_permanent: false,
      duration: 60,
      is_active: false,
      allow_multiple: false,
      topic: context.topic_sports,
      total_voted: 0,
    });

    context.poll5 = em.create(Poll, {
      title: "What is your favorite movie?",
      description: "Please select your favorite movie from the list below.",
      created_by: context.user3,
      is_permanent: false,
      duration: 60,
      is_active: true,
      allow_multiple: true,
      topic: context.topic_enterainment,
      total_voted: 0,
    });
  }
}
