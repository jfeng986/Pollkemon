import { Property, Entity, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";
import { Topic } from "./Topic.js";

@Entity({ tableName: "polls" })
export class Poll extends BaseEntity {
  @Property()
  title!: string;

  @ManyToOne(() => Topic)
  topic!: Topic;

  @Property()
  description!: string;

  @ManyToOne(() => User)
  created_by!: User;

  @Property()
  is_permanent!: boolean;

  @Property()
  duration!: number; // in hours permanent if -1

  @Property()
  is_active!: boolean;

  @Property()
  allow_multiple!: boolean;
}
