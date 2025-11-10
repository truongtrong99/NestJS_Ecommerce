import { ConfigService } from "@nestjs/config"
import { MongooseModuleFactoryOptions } from "@nestjs/mongoose"


const dev = {
    app: {
        port: 'PORT',
    },
    db: {
        host: 'DEV_DB_HOST',
        name: 'DEV_DB_NAME',
        user: 'DEV_DB_USER',
        pass: 'DEV_DB_PASS',
        cluster: 'DEV_DB_CLUSTER',
    },
}

const prod = {
    app: {
        port: 'PRO_APP_PORT',
    },
    db: {
        host: 'PRO_DB_HOST',
        name: 'PRO_DB_NAME',
        user: 'PRO_DB_USER',
        pass: 'PRO_DB_PASS',
        cluster: 'PRO_DB_CLUSTER',
    },
}

const configurationVal = {
    dev,
    prod,
}

const getURLMongoDB = (configService: ConfigService) => {
    const env = configService.get('NODE_ENV') || 'dev';
    const { db } = configurationVal[env];
    const user = configService.get(db.user);
    const pass = configService.get(db.pass);
    const cluster = configService.get(db.cluster);
    const name = configService.get(db.name);
    const host = configService.get(db.host);
    return `${host}://${user}:${pass}@${cluster}/${name}`;
}

export const mongooseConfiguration = (configService: ConfigService): Promise<MongooseModuleFactoryOptions> | MongooseModuleFactoryOptions => {
    const mongoURL = getURLMongoDB(configService);
    return {
        uri: mongoURL,
    };
}