import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';


class FlatfileDatabaseAdaptor {
    /* Abstracts the flatfile-based database so it can be replaced with a real database later */
    constructor(dbDir) {
        // The "database" is a directory of JSON files
        this._dbDir = dbDir;
        if (!existsSync(this._dbDir)) {
            mkdirSync(this._dbDir);
        }

        // Try to get current data or create blank files if needed
        try {
            const acronyms = readFileSync(`${this._dbDir}/acronym.json`)
            this.acronyms = JSON.parse(acronyms);
        } catch(e) {
            this.acronyms = [];
            // Write file synchronously at first launch or corrupt data
            writeFileSync(`${this._dbDir}/acronym.json`, JSON.stringify(this.acronyms));
        }
    }
    
    _writeDB() {
        writeFile(
            `${this._dbDir}/acronym.json`,
            JSON.stringify(this.acronyms)
        ).then(
            () => console.log("Wrote to flatfile database."),
            () => console.error("Failed while writing to flatfile database.")
        ).catch(
            () => console.error("Exception while writing to flatfile database.")
        );
    }

    search(search) {
        return this.acronyms.filter((acronymObj) => acronymObj.acronym == search);
    }

    _getIndex(acronymID) {
        let i=0;
        for (i; i < this.acronyms.length; i++) {
            if (this.acronyms[i]._id == acronymID) return i
        }
        return -1
    }

    get(acronymID) {
        const acronym = this.acronyms.filter((acronymObj) => acronymObj._id == acronymID);
        if (acronym.length != 1) return null
        return acronym.pop()
    }

    put(acronymObj) {
        const acronymID = randomUUID().toString();
        const newAcronymObj = {"_id": acronymID, ...acronymObj};
        this.acronyms.push(newAcronymObj);
        this._writeDB();
        return acronymID;
    }

    patch(acronymID, acronymObj) {
        const acronymIndex = this._getIndex(acronymID);
        if (acronymIndex < 0) return false
        this.acronyms[acronymIndex] = { "_id": acronymID, ...acronymObj };
        this._writeDB();
        return true
    }

    delete(acronymID) {
        const acronymIndex = this._getIndex(acronymID);
        if (acronymIndex < 0) return false
        this.acronyms.splice(acronymIndex, acronymIndex+1);
        this._writeDB();
        return true
    }
}

const db = new FlatfileDatabaseAdaptor(`${process.env.MODE}DB`);

export default db;