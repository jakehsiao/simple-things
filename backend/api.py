from flask import Flask, request # why it's okay to use request.form directly?
from flask_restful import Resource, Api
from flask_pymongo import PyMongo
from flask_cors import CORS
import logging
from perspectives import *

app = Flask(__name__)

# Logging
handler = logging.FileHandler("err.log")
handler.setLevel(logging.ERROR)
app.logger.addHandler(handler)

# CORS
CORS(app)

# mongodb configs
app.config['MONGO_URI'] = "mongodb://localhost:27017/simplethings" # Change this when db is changed
mongo = PyMongo(app)
db = mongo.db

# api configs
api = Api(app)

class HelloAPI(Resource):

    def get_request_data(self):
        req = request.get_json(force=True) # I don't know how to make it realize that it's json so I set force to true
        # TODO: add try catch to this, maybe try "is_json" would be a good idea
        # EH: change all "res" to "req"
        return req

    def get_perspective(self, req):
        if req["persp_type"] == "inbox":
            return INBOX()

        elif req["persp_type"] in ["project", "tags"]:
            # Note: use project in single and tags in multiple to be consist with database
            return pt_perspective(req["persp_type"], req["persp_value"])

        elif req["persp_type"] == "perspective":
            # To be continue developed
            persp = db.perspectives.find_one({"name": req["persp_value"]})
            return custom_tags_perspective(persp["and_tags"], persp["any_tags"], persp["not_tags"])

    def get_advanced(self):
        req = request.args

        # Get inbox
        if req["content"] == "inbox":
            return {"perspectives": ["Inbox"]}

        # Get projects
        elif req["content"] == "project":
            return {"perspectives": db.things.distinct("project")}

        # Get tags
        elif req["content"] == "tags":
            return {"perspectives": db.things.distinct("tags")}

        # Get perspectives
        elif req["content"] == "perspective":
            return {"perspectives": db.perspectives.distinct("name")}

        # Get according to a perspective
        elif req["content"] == "things":
            return {"things": list(db.things.find(self.get_perspective(req), {"_id":0}))}


    def get(self):
        if request.args:
            return self.get_advanced()
        else:
            things = list(db.things.find({}, {"_id":0}))
            return {"things": things}

    def post(self):
        req = self.get_request_data()
        db.things.insert_one(req)
        return db.things.find_one({"data": req["data"]}, {"_id":0, "data":1})

    def put(self):
        req = self.get_request_data()
        for field in req:
            if field != "data":
                db.things.update({"data": req["data"]}, {"$set": {field: req[field]}})
        return db.things.find_one({"data": req["data"]}, {"_id":0})

    def delete(self):
        req = self.get_request_data()
        db.things.delete_one({"data": req["data"]})
        return {}


api.add_resource(HelloAPI, "/api")