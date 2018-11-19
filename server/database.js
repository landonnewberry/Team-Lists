const uuid = require('node-uuid');

const data = {
    documents: [
        {
            id: uuid.v4(),
            available: true,
            shared: false,
            title: "Meine Hobbys",
            items: [
                { id: uuid.v4(), value: "Laufen gehen" },
                { id: uuid.v4(), value: "Kuchen backen" },
                { id: uuid.v4(), value: "Spielen mit meinem Hund" }
            ]
        },
        {
            id: uuid.v4(),
            available: true,
            shared: false,
            title: "Fernsehsendungen",
            items: [
                { id: uuid.v4(), value: "GBBO" },
                { id: uuid.v4(), value: "The Office" },
                { id: uuid.v4(), value: "Gibt es gute deutsche Fernsehsendungen?" }
            ]
        }
    ]
};

/* can easily be replaced by a real mongo query */
const fetchAllDocuments = () => 
    new Promise(resolve => 
        setTimeout(
            () => resolve(data.documents),
            1500
        )
    );

const loadInitialState = () =>
    new Promise(resolve =>
        fetchAllDocuments().then(data => {
            const allIds = data.map(doc => doc.id);
            let byId = {};
            allIds.forEach(id =>
                byId[[id]] = data.filter(doc => doc.id === id)[0]
            );
            resolve({
                documents: {
                    allIds,
                    byId
                }
            });
        })
    );

module.exports = {
    loadInitialState
};