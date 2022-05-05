/* Functions to register routes onto Express app router */


export const acronymRoutes = (appRouter, db, url='/acronym') => {
    // GET route
    appRouter.get(url, (req, res) => {
        const abort = (message) => res.status(404).send({ message: message });

        if (!req.query.search) {
            abort("Missing search term");
            return
        }
        const acronymResults = db.get(req.query.search);
        res.send(acronymResults);
    });

    // POST route
    appRouter.post(url, (req, res) => {
        const abort = () => res.status(400).send({ message: "Invalid acronym" });
        try {
            if (typeof req.body.acronym !== 'string' ||
                    typeof req.body.definition !== 'string') {
                abort();
                return
            }
        } catch(e) {
            abort();
            return
        }
        const acronymID = db.put({
            "acronym": req.body.acronym,
            "definition": req.body.definition
        });
        res.sendStatus(204);
    });
};
