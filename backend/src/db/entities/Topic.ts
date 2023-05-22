import { Property, Entity } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";

@Entity({ tableName: "topics" })
export class Topic extends BaseEntity {
  @Property()
  topic_name!: string;
}
