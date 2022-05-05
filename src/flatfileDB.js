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
    
    writeDB() {
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

    get(search) {
        return this.acronyms.filter((acronymObj) => acronymObj.acronym == search);
    }

    put(acronymObj) {
        const acronymID = randomUUID().toString();
        const newAcronymObj = {"_id": acronymID, ...acronymObj};
        this.acronyms.push(newAcronymObj);
        this.writeDB();
        return acronymID;
    }
}

const db = new FlatfileDatabaseAdaptor(`${process.env.MODE}DB`);

export default db;