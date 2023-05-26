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

    context.topic_food = em.create(Topic, {
      topic_name: "Food",
    });

    context.topic_politics = em.create(Topic, {
      topic_name: "Politics",
    });

    context.topic_business = em.create(Topic, {
      topic_name: "Business",
    });

    context.topic_health = em.create(Topic, {
      topic_name: "Health",
    });

    context.topic_lifestyle = em.create(Topic, {
      topic_name: "Lifestyle",
    });

    context.topic_fashion = em.create(Topic, {
      topic_name: "Fashion",
    });

    context.topic_education = em.create(Topic, {
      topic_name: "Education",
    });

    context.topic_culture = em.create(Topic, {
      topic_name: "Culture",
    });

    context.topic_history = em.create(Topic, {
      topic_name: "History",
    });

    context.topic_other = em.create(Topic, {
      topic_name: "Other",
    });
  }
}
