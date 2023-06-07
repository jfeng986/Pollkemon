import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Topic } from "../entities/Topic.js";

export class TopicSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    context.topic_sports = em.create(Topic, {
      topic_name: "Sports",
      votes: 0,
    });

    context.topic_enterainment = em.create(Topic, {
      topic_name: "Entertainment",
      votes: 0,
    });

    context.topic_tech = em.create(Topic, {
      topic_name: "Technology",
      votes: 0,
    });

    context.topic_science = em.create(Topic, {
      topic_name: "Science",
      votes: 0,
    });

    context.topic_travel = em.create(Topic, {
      topic_name: "Travel",
      votes: 0,
    });

    context.topic_food = em.create(Topic, {
      topic_name: "Food",
      votes: 0,
    });

    context.topic_politics = em.create(Topic, {
      topic_name: "Politics",
      votes: 0,
    });

    context.topic_business = em.create(Topic, {
      topic_name: "Business",
      votes: 0,
    });

    context.topic_health = em.create(Topic, {
      topic_name: "Health",
      votes: 0,
    });

    context.topic_lifestyle = em.create(Topic, {
      topic_name: "Lifestyle",
      votes: 0,
    });

    context.topic_fashion = em.create(Topic, {
      topic_name: "Fashion",
      votes: 0,
    });

    context.topic_education = em.create(Topic, {
      topic_name: "Education",
      votes: 0,
    });

    context.topic_culture = em.create(Topic, {
      topic_name: "Culture",
      votes: 0,
    });

    context.topic_history = em.create(Topic, {
      topic_name: "History",
      votes: 0,
    });

    context.topic_other = em.create(Topic, {
      topic_name: "Other",
      votes: 0,
    });
  }
}
