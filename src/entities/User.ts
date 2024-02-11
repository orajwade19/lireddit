import { Entity, Opt, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity()
export class User {

  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property()
  createdAt: Date & Opt = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();

  @Field()
  @Property({type: 'text',unique: true})
  username!: string;

  @Property({type: 'text',unique: true})
  password!: string;
}