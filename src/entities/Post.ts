import { Entity, Opt, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity()
export class Post {

  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property()
  createdAt: Date & Opt = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();

  @Field()
  @Property({type: 'text'})
  title!: string;
}