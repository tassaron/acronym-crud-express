/* Functions to register routes onto Express app router */

import { randomUUID } from 'crypto';


export const acronymRoutes = (appRouter) => {
    appRouter.get('/acronym', (req, res) => {
        res.send('Get!');
    });
    appRouter.post('/acronym', (req, res) => {
        const acronymID = randomUUID();
        if (typeof req.body.acronym === 'string') {
            res.send(`${acronymID}`);
        } else {
            res.status(400).send({ message: "Invalid acronym" });
        }
    });
};
