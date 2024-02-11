import {MikroORM} from "@mikro-orm/core"
import { __prod__ } from "./constants"
import {Post} from "./entities/Post"
import mikroConfig from "./mikro-orm.config"
import express from "express"
import {ApolloServer} from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"

import RedisStore from "connect-redis"
import session from "express-session"
import cors from "cors"
import {createClient} from "redis"
import { MyContext } from "./types"


const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();

    // Initialize client.
    let redisClient = createClient()
    redisClient.connect().catch(console.error)

    // Initialize store.
    let redisStore = new RedisStore({
    client: redisClient,
    prefix: "lireddit:",
    disableTouch:true,
    })

    app.set('trust proxy', true);
    app.use(
        cors({
            credentials: true,
            origin: [
                "https://studio.apollographql.com",
                "http://localhost:4000/graphql"
            ]
        })
    );

// Initialize session storage.
    app.use(
    session({
    name: 'qid',
    store: redisStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: 'none', //csrf
        secure: true //cookie only works in https
    },
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: "sadasdasdadsd",
    }),
    );

    const apolloServer = new ApolloServer(
        {
            schema : await buildSchema({
                resolvers: [HelloResolver,PostResolver,UserResolver],
                validate: false
            }),
            context : ( {req,res}): MyContext => ({ em : orm.em, req,res })
        }
    );

    await apolloServer.start();

    apolloServer.applyMiddleware({ app,
    cors:{
        credentials: true,
        origin: [
            "https://studio.apollographql.com",
            "http://localhost:4000/graphql"
        ]
    } });

    app.get('/',(_,res) => {
        res.send("hello");
    })
    app.listen(4000, () => {
        console.log("Server started on localhost:4000");
    })
};

main().catch( err => { 
    console.error(err);
});