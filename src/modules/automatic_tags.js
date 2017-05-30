// import db from "../db"
// module.exports = {
//     tags: function(subject, email_date) {
//         return new Promise((resolve, reject) => {
//             let tag = "";
//             db.Tag.findAll({ type: "Automatic" })
//                 .then((data) => {
//                     for (let i = 0; i < data.length; i++) {
//                         let res = new RegExp(data[i].title, 'gi');
//                         let tag = subject.match(res);
//                         if (tag != null) {
//                             resolve({ tags: tag, id: data[i].id });
//                         } else {
//                             db.Tag.findOne({ where: { from: { $lte: email_date }, $or: [{ to: { $gte: email_date } }] } })
//                                 .then((tag) => {
//                                      resolve({ tags: tag, id: data[i].id });
//                                     console.log("+++++++++++++++++++")
//                                     console.log(tag)
//                                     console.log("+++++++++++++++++++")
//                                 })
//                         }
//                         // } else {
//                         //     if (i < data.length - 1) {
//                         //         continue
//                         //     } else {
//                         //         resolve({ tags: null, id: null })
//                         //     }
//                         // }
//                     }
//                 })
//         })
//     }
// };



import db from "../db"
module.exports = {
    tags: function(subject, email_date) {
        return new Promise((resolve, reject) => {
            let tag = "";
            db.Tag.findAll({ type: "Automatic" })
                .then((data) => {
                    for (let i = 0; i < data.length; i++) {
                        let res = new RegExp(data[i].title, 'gi');
                        let tag = subject.match(res);
                        if (tag != null) {
                            resolve({ tags: tag, id: data[i].id });
                        } else {
                            if (i < data.length - 1) {
                                continue
                            } else {
                                resolve({ tags: null, id: null })
                            }
                        }
                    }
                })
        })
    }
};



// import db from "../db"
// module.exports = {
// tags: function(subject, email_date, callback) {
//         db.Tag.findAll({
//                 type: "Automatic"
//             })
//             .then((data) => {
//                 if (data) {
//                     for (let i = 0; i < data.length; i++) {
//                         let res = new RegExp(data[i].title, 'gi'),
//                             tag = subject.match(res);
//                         callback(tag);
//                     }
//                 } else {
//                     db.Tag.findOne({ where: { from: { $lte: email_date }, $or: [{ to: { $gte: email_date } }] } })
//                         .then((docs, err) => {
//                             if (docs) {
//                                 console.log(docs);
//                             } else {
//                                 console.log(err);
//                             }
//                         });
//                 }
//             })
//     }
// };
