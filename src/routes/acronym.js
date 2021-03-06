/* Routes related to the Acronym resource */

const errMsg = "Invalid acronym";
const abort = (res, message) => res.status(400).send({ message: message });


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
export const acronymRouter = (appRouter, createDB, url='/acronym') => {

    const db = createDB("acronym");

    const get = (req, res) => {
        if (!req.query.search) {
            abort(res, "Missing search term");
            return
        }
        const acronymResults = db.search(req.query.search, "acronym");
        const [totalPages, currentPage] = db.paginate(acronymResults, req.query.page, req.query.limit);
        res.setHeader('Pagination-Count', totalPages)
            .setHeader('Pagination-Page', req.params.page ? req.params.page : 1)
            .setHeader('Pagination-Limit', req.params.limit ? req.params.limit : 1)
            .send(currentPage);
    }


    const post = (req, res) => {
        if (!validateInput(req, res)) return;
        const acronymID = db.put({
            "acronym": req.body.acronym,
            "definition": req.body.definition
        });
        res.status(201).send({ "id": acronymID });
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
