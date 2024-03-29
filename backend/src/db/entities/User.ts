import { Entity, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";

@Entity({ tableName: "users" })
export class User extends BaseEntity {
  @Property()
  @Unique()
  email!: string;

  @Property()
  username!: string;

  @Property()
  voted_polls!: number[];
}
