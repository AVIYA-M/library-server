export const books = [
    {
        id: 1,
        name: "חי צקלופדיה",
        category: "מדע/עיון",
        price: 85,
        isBorrowed: false, 
        borrows: [] 
    },
    {
        id: 2,
        name: "דופליקטים",
        category: "פנטזיה",
        price: 70,
        isBorrowed: true, 
        borrows: [
            { borrowDate: "2026-07-15", clientId: 201 } 
        ]
    },
    {
        id: 3,
        name: "קומיקס סבא",
        category: "ילדים",
        price: 20,
        isBorrowed: false, 
        borrows: [
            { borrowDate: "2026-06-01", clientId: 202 } 
        ]
    }
];