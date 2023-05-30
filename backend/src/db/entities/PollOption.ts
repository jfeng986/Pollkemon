import {
  Property,
  Entity,
  ManyToOne,
  ManyToMany,
  Collection,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";
import { Poll } from "./Poll.js";

@Entity({ tableName: "poll_options" })
export class PollOption extends BaseEntity {
  @Property()
  option_name!: string;

  @ManyToOne(() => Poll)
  Poll!: Poll;

  @ManyToMany(() => User)
  users = new Collection<User>(this);

  @Property()
  voted_num!: number;
}
