import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Topic } from "../entities/Topic.js";

export class TopicSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    context.topic_sports = em.create(Topic, {
      topic_name: "Sports",
    });

    context.topic_enterainment = em.create(Topic, {
      topic_name: "Entertainment",
    });

    context.topic_tech = em.create(Topic, {
      topic_name: "Technology",
    });

    context.topic_science = em.create(Topic, {
      topic_name: "Science",
    });

    context.topic_travel = em.create(Topic, {
      topic_name: "Travel",
    });

    context.topic_other = em.create(Topic, {
      topic_name: "Other",
    });
  }
}
