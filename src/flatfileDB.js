import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';


/** Abstracts the flatfile-based database so it can be replaced with a real database later */
class FlatfileDatabaseAdaptor {
    constructor(dbDir, resourceName) {
        // The "database" is a directory of JSON files
        this._dbDir = dbDir;
        this._resourceName = resourceName;
        if (!existsSync(this._dbDir)) {
            mkdirSync(this._dbDir);
        }

        // Try to get current data or create blank files if needed
        try {
            const items = readFileSync(`${this._dbDir}/${resourceName}.json`)
            this.items = JSON.parse(items);
        } catch(e) {
            this.items = [];
            // Write file synchronously at first launch or corrupt data
            writeFileSync(`${this._dbDir}/${resourceName}.json`, JSON.stringify(this.items));
        }
    }
    
    _writeDB() {
        writeFile(
            `${this._dbDir}/${this._resourceName}.json`,
            JSON.stringify(this.items)
        ).then(
            () => console.log("Wrote to flatfile database."),
            () => console.error("Failed while writing to flatfile database.")
        ).catch(
            () => console.error("Exception while writing to flatfile database.")
        );
    }

    paginate(data, page, limit) {
        if (!data) return []
        if (!page) page = 1;
        if (!limit) limit = 10;
        const currentPage = data.slice((limit * page) - limit, limit * page);
        const totalPages = Math.ceil(data.length / limit);
        return [totalPages, currentPage]
    }

    search(search, prop) {
        const items = this.items.filter((itemObj) => itemObj[prop].indexOf(search) != -1);
        return items;
    }

    _getIndex(itemID) {
        let i=0;
        for (i; i < this.items.length; i++) {
            if (this.items[i]._id == itemID) return i
        }
        return -1
    }

    get(itemID) {
        const item = this.items.filter((itemObj) => itemObj._id == itemID);
        if (item.length != 1) return null
        return item.pop()
    }

    put(itemObj) {
        const itemID = randomUUID().toString();
        const newitemObj = {"_id": itemID, ...itemObj};
        this.items.push(newitemObj);
        this._writeDB();
        return itemID;
    }

    patch(itemID, itemObj) {
        const itemIndex = this._getIndex(itemID);
        if (itemIndex < 0) return false
        this.items[itemIndex] = { "_id": itemID, ...itemObj };
        this._writeDB();
        return true
    }

    delete(itemID) {
        const itemIndex = this._getIndex(itemID);
        if (itemIndex < 0) return false
        this.items.splice(itemIndex, itemIndex+1);
        this._writeDB();
        return true
    }
}


/** Create flatfile DB for given resourceName */
const db = (resourceName) => new FlatfileDatabaseAdaptor(`${process.env.MODE}DB`, resourceName);


export default db;