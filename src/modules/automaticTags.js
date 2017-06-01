import db from "../db"
import _ from "lodash";
import constant from "../models/constant";
import mail from "../modules/mail";
import replace from "../modules/replaceVariable";

module.exports = {
    tags: function(subject, email_date, from, email) {
        return new Promise((resolve, reject) => {
            let count = 0;
            let tagId = [];
            let template_id = [];
            db.Tag.findAll({ where: { type: "Automatic" } })
                .then((data) => {
                    _.forEach(data, (val, key) => {
                        if ((subject.match(new RegExp(val.title, 'gi'))) || (new Date(email_date).getTime() < new Date(val.to).getTime() && new Date(email_date).getTime() > new Date(val.from).getTime())) {
                            tagId.push(val.id)
                            template_id.push(val.template_id)
                        } else {
                            ++count;
                            if (count == _.size(data)) {
                                resolve({ tagId: null });
                            }
                        }
                    })
                    db.Template.findOne({
                        where: {
                            id: template_id[0]
                        }
                    }).then((data) => {
                        replace.filter(data.body, from)
                            .then((html) => {
                                mail.sendMail(email, data.subject, "template", constant().smtp.from, html)
                                    .then((response) => {
                                        resolve({ message: "Email Send Successfully", tagId: tagId.toString() })
                                    })
                            });
                    })
                })
        })
    }
};