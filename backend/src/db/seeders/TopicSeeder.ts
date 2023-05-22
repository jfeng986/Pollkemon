import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Topic } from "../entities/Topic.js";

export class TopicSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(Topic, {
      topic_name: "Sports",
    });

    em.create(Topic, {
      topic_name: "Politics",
    });

    em.create(Topic, {
      topic_name: "Entertainment",
    });

    em.create(Topic, {
      topic_name: "Technology",
    });

    em.create(Topic, {
      topic_name: "Science",
    });

    em.create(Topic, {
      topic_name: "Health",
    });

    em.create(Topic, {
      topic_name: "Business",
    });

    em.create(Topic, {
      topic_name: "Education",
    });

    em.create(Topic, {
      topic_name: "Travel",
    });

    em.create(Topic, {
      topic_name: "Other",
    });
  }
}
