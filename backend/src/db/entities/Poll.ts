import { Entity, Property, ManyToOne, Enum } from "@mikro-orm/core";
import { User } from "./User.js";
import { BaseEntity } from "./BaseEntity.js";

enum Topic {
  School = "School",
  Car = "Car",
  Food = "Food",
  Movie = "Movie",
  Music = "Music",
  Sport = "Sport",
  Travel = "Travel",
  Game = "Game",
  Other = "Other",
}

@Entity()
export class Poll extends BaseEntity {
  @Property()
  title!: string;

  @Enum({ items: () => Topic })
  topic!: Topic;

  @Property()
  description!: string;

  @ManyToOne(() => User)
  created_by!: User;

  @Property()
  options!: Map<string, User[]>; // option -> users who voted for it

  @Property()
  is_permanent!: boolean;

  @Property()
  duration!: number; // in hours permanent if -1

  @Property()
  is_active!: boolean;

  @Property()
  allow_multiple!: boolean;
}
