/* Functions to register routes onto Express app router */

export const acronymRoutes = (appRouter) => {
    appRouter.get('/acronym', (req, res) => {
        res.send('Get!');
    });
    appRouter.post('/acronym', (req, res) => {
        res.send('Post!');
    });
};
