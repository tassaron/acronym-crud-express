/* Routes related to the Acronym resource */

const errMsg = "Invalid acronym";
const abort = (res, message) => res.status(404).send({ message: message });


/** Validate req.body to ensure all fields are strings
 * @returns {boolean} whether is valid
 * */
const validateInput = (req, res) => {
    try {
        if (typeof req.body.acronym !== 'string' ||
                typeof req.body.definition !== 'string') {
            abort(res, errMsg);
            return false
        }
    } catch(e) {
        abort(res, errMsg);
        return false
    }
    return true
};


/** Handles all routes related to Acronym resource */
export const acronymRouter = (appRouter, db, url='/acronym') => {
    const get = (req, res) => {
        if (!req.query.search) {
            abort(res, "Missing search term");
            return
        }
        const acronymResults = db.search(req.query.search);
        res.send(acronymResults);
    }
    
    
    const post = (req, res) => {
        if (!validateInput(req, res)) return;
        const acronymID = db.put({
            "acronym": req.body.acronym,
            "definition": req.body.definition
        });
        res.status(200).send({ "id": acronymID });
    }
    
    
    const patch = (req, res) => {
        if (!validateInput(req, res)) return;
        const success = db.patch(req.params.acronymID, {
            "acronym": req.body.acronym,
            "definition": req.body.definition
        });
        if (success) {
            res.sendStatus(204);
            return
        }
        abort(res, errMsg);
    }
    
    
    const delete_ = (req, res) => {
        const success = db.delete(req.params.acronymID);
        if (success) {
            res.sendStatus(204);
            return
        }
        abort(res, errMsg);
    }
    
    
    appRouter.get(url, get);
    appRouter.post(url, post);
    appRouter.patch(`${url}/:acronymID`, patch);
    appRouter.delete(`${url}/:acronymID`, delete_);
}
