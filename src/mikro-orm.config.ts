import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { Post } from "./entities/Post";
import { __prod__ } from "./constants";
import path from 'path';

export default defineConfig({
    extensions: [Migrator],
    migrations: {
        path: path.join(__dirname,"./migrations"), // path to the folder with migrations
        pathTs: path.join(__dirname,"./migrations"), // path to the folder with TS migrations (if used, you should put path to compiled files in `path`)
        glob: '!(*.d).{js,ts}'
    }, // how to match migration files (all .js and .ts files, but not .d.ts)
    entities: [Post],
    dbName: "lireddit",
    password: "pg",
    allowGlobalContext: true, //this is bad 
//  type: "postgresql", not needed with `defineConfig()`
    debug : !__prod__,
});

