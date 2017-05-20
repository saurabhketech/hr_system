import BaseAPIController from "./BaseAPIController";

export class InboxController extends BaseAPIController {

    /* Get INBOX data*/
	getInbox = (req, res, next) => {
		req.email.find().skip((req.params.page - 1) * 21).limit(21).exec((err, data) => {
			if (err) {
				next(new Error("invalid page"));
			} else {
				res.json({ data });
			}
		});
	}

    /* Get UID data*/
	getUid = (req, res, next) => {
		req.email.findOne({ uid: parseInt(req.params.uid) }, (err, data) => {
			if (err) {
				next(new Error("invalid UID"));
			} else {
				res.json({ data });
			}
		});
	}
}

const controller = new InboxController();
export default controller;
