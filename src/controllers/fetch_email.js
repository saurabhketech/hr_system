import BaseAPIController from "./BaseAPIController";
import MailProvider from "../providers/MailProvider";
import * as _ from "lodash";

export class FetchController extends BaseAPIController {
    /* Get INBOX data */
    fetch = (req, res, next) => {
        var page = req.body.page;
        var tag_id = req.body.tag_id;
        if (!page || !isNaN(page) == false || page <= 0) {
            page = 1;
        }
        if (!tag_id || !isNaN(tag_id) == false || tag_id <= 0) {
            tag_id = undefined;
        }
        req.email.find({
            tag_id: {
                $in: [tag_id]
            }
        }).skip((page - 1) * 21).limit(21).sort({uid:-1}).exec(function(err, data) {
            if (err) {
                next(err);
            } else {
                res.json({
                    data: data,
                    status: 1,
                    message: "success"
                });
            }
        });
    }

    assignTag = (req, res, next) => {
        MailProvider.assignTag(req.checkBody, req.body, req.getValidationResult())
            .then(() => {
                this._db.Tag.tag(req.body.tag_id)
                    .then((data) => {
                        if (data.status) {
                            req.email.findOneAndUpdate({
                                "_id": req.body.mongo_id
                            }, {
                                "$addToSet": {
                                    "tag_id": req.body.tag_id
                                }
                            }).exec(function(err, data) {
                                if (err) {
                                    next(new Error(err));
                                } else {
                                    res.json({
                                        data: data,
                                        status: 1,
                                        message: "success"
                                    });
                                }
                            });
                        } else {
                            next(new Error("invalid tag id"));
                        }
                    })
                    .catch(this.handleErrorResponse.bind(null, res));
            })
            .catch(this.handleErrorResponse.bind(null, res));
    }

    countEmail = (req, res, next) => {
        var totalCount = [];
        var count1 = [];
        var tagId = [];
        req.email.aggregate({
            $group: {
                _id: "$tag_id",
                count_email: {
                    $sum: 1
                },
                unread: {
                    $sum: {
                        $cond: [{
                            $eq: ["$unread", "false"]
                        }, 0, 1]
                    },
                },

            }
        }, (err, result) => {
            if (err) {
                next(new Error(err));
            } else {
                this._db.Tag.findAll()
                    .then((data) => {
                        _.forEach(data, (val2, key2) => {
                            tagId.push(val2.id.toString());
                        })
                        _.map(tagId, (val) => {
                            var res = filter(val);
                            totalCount.push(res);
                        });
                        _.forEach(result, (val, key) => {
                            if (val._id == null) {
                                count1.push(_.merge(val, {
                                    title: "Mails",
                                    color: "#81d4fa",
                                    type: "Main"
                                }));
                            }
                        })

                        function filter(tagId) {
                            var b = _.filter(result, function(o) {
                                if (_.includes(o._id, tagId)) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                            var count_email = 0;
                            var unread = 0;
                            _.map(b, (val, i) => {
                                count_email += val.count_email;
                                unread += val.unread;
                            });
                            return {
                                id: tagId,
                                count_email: count_email,
                                unread: unread
                            };
                        }
                        _.forEach(totalCount, (val, key) => {
                            _.forEach(data, (val1, key1) => {
                                if (val.id == val1.id) {
                                    count1.push(_.merge(val, {
                                        title: val1.title,
                                        color: val1.color,
                                        type: val1.type
                                    }));
                                }
                            })
                        });
                        res.json({
                            data: count1,
                            status: 1,
                            message: "success"
                        })
                    });
            }
        });
    }

    assignMultiple = (req, res, next) => {
        MailProvider.assignTag(req.checkBody, req.body, req.getValidationResult())
            .then(() => {
                this._db.Tag.tag(req.body.tag_id)
                    .then((data) => {
                        if (data.status) {
                            _.each(req.body.mongo_id, function(val, key) {
                                req.email.findOneAndUpdate({
                                    "_id": val
                                }, {
                                    "$addToSet": {
                                        "tag_id": req.body.tag_id
                                    }
                                }).exec(function(err) {
                                    if (err) {
                                        next(new Error(err));
                                    } else {
                                        if (key == (_.size(req.body.mongo_id) - 1)) {
                                            res.json({
                                                status: 1,
                                                message: "success"
                                            });
                                        }
                                    }
                                });
                            });
                        } else {
                            next(new Error("invalid tag id"));
                        }
                    })
                    .catch(this.handleErrorResponse.bind(null, res));
            })
            .catch(this.handleErrorResponse.bind(null, res));
    }


    deleteTag = (req, res, next) => {
        MailProvider.assignTag(req.checkBody, req.body, req.getValidationResult())
            .then(() => {
                this._db.Tag.tag(req.body.tag_id)
                    .then((data) => {
                        if (data.status) {
                            _.each(req.body.mongo_id, function(val, key) {
                                req.email.findOneAndUpdate({
                                    "_id": val
                                }, {
                                    "$pull": {
                                        "tag_id": req.body.tag_id
                                    }
                                }).exec(function(err) {
                                    if (err) {
                                        next(new Error(err));
                                    } else {
                                        if (key == (_.size(req.body.mongo_id) - 1)) {
                                            res.json({
                                                status: 1,
                                                message: "success"
                                            });
                                        }
                                    }
                                });
                            });
                        } else {
                            next(new Error("invalid tag id"));
                        }
                    })
                    .catch(this.handleErrorResponse.bind(null, res));
            })
            .catch(this.handleErrorResponse.bind(null, res));
    }

     changeUnreadStatus = (req, res, next) => {
        MailProvider.changeUnreadStatus(req.checkBody, req.body, req.getValidationResult())
            .then(() => {
                req.email.findOneAndUpdate({
                    _id: req.body.mongo_id
                }, {
                    $set: {
                        unread: false
                    }
                }, function(err, data) {
                    if (err) {
                        res.json({ status: 0, message: err });
                    }
                    if (!data) {
                        res.json({ status: 0, msg: "not found" });
                    } else {
                        res.json({ status: 1, message: " the unread status is changed successfully", data: data });
                    }
                })
            })
            .catch(this.handleErrorResponse.bind(null, res));
    }

deleteEmail = (req, res, next) => {
    var response = [];
    MailProvider.deleteEmail(req.checkBody, req.body, req.getValidationResult())
        .then(() => {
            var size = _.size(req.body.mongo_id);
            _.forEach(req.body.mongo_id, (val, key) => {
                req.email.findOne({
                    _id: val
                }, function(err, data) {
                    if (err) {
                        response.push({status: 0,  message: err,array_length: key});
                    }
                    if (!data) {
                        response.push({status: 0,msg: "not found",array_length: key  });
                    } else {
                        data.remove();
                        response.push({status: 1,msg: "delete success",array_length: key});
                    }
                    if (key == (size - 1)) {
                        res.json({status: 1,message: "success",data: response});
                    }
                })
            })

        })
        .catch(this.handleErrorResponse.bind(null, res));
    }
  }

const controller = new FetchController();
export default controller;
