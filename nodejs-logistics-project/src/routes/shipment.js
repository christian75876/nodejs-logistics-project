import { Router } from "express";
import {fileURLToPath} from "url";
import {promises as fs} from "fs";
import path from "path";

const routerShipment = Router();

const _fileName = fileURLToPath(import.meta.url);
const _dirName = path.dirname(_fileName);

const route = path.join(_dirName, "../../data/shipments.json");

const readFile = async () => {
    try {
        const data = await fs.readFile(route, "utf8");
        return JSON.parse(data);  
    } catch (error) {
        throw new Error(error.message)
    }
};

const writeFile = async (newData) => {
    try {
        const data = await fs.writeFile(route, JSON.stringify(newData, null, 2), "utf8");
        return JSON.stringify(newData);
    } catch (error) {
        throw new Error(error.message)
    }
};

routerShipment.get('/', async (req, res) => {
    try {
        const data = await readFile();
        res.json(data);
    } catch (error) {
        res.status(500).sendStatus(error.message);
    }
});

routerShipment.post('/', async (req, res) => {
    try {
        const data = await readFile();
        const newData = {
            id: data.length + 1,
            items: data.body.items,
            quantity: data.body.quantity,
            warehouseId: data.body.warehouseId
        };
        data.push(newData);
        await writeFile(data);
        res.status(200)
    } catch (error) {
        res.status(500).sendStatus(error.message);
    }
});

export default routerShipment;

