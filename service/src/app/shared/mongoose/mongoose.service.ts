import { Component, Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';

import { Environments } from '../../shared/environments';

import { MongooseConfig } from './mongoose.confg';

@Component()
export class MongooseService {
    private readonly logger = new Logger(MongooseService.name);

    private instance: mongoose.Connection;

    constructor() {
        // (mongoose as any).Promise = global.Promise;
    }
    get connection() {
        if (Environments.isTest()) {
            return (this.instance = mongoose.connection);
        }
        if (this.instance) {
            return this.instance;
        } else {
            (mongoose as any).Promise = global.Promise;
            mongoose.connect(this.setConfig(), {
                useMongoClient: true,
            });
            this.instance = mongoose.connection;
            return this.instance;
        }
    }

    private setConfig() {
        const mongooseConfig: MongooseConfig = new MongooseConfig();

        return mongooseConfig.configure();
    }
}