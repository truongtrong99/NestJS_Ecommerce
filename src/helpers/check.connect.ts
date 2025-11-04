import mongoose from "mongoose";
import os from "os";
import process from "process";

const _SECONDS = 5000;

const countConnections = () => {
    const numberConnections = mongoose.connections.length;
    console.log(`Number of active database connections: ${numberConnections}`);
    return numberConnections;
}

const checkOverLoad = () => {
    setInterval(() => {
        const connections = countConnections();
        const numsCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
        const maxConnections = numsCores * 5;
        console.log(`Number of CPU Cores: ${numsCores}`);
        console.log(`Memory Usage: ${memoryUsage} MB`);
        if (connections > maxConnections) {
            console.warn(`High number of connections: ${connections}. Max allowed is ${maxConnections}.`);
        }
    }, _SECONDS);
}

export { countConnections, checkOverLoad };
