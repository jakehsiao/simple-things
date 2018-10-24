from pymongo import MongoClient


def INBOX():
    return {"project": {"$exists": False}, "tags": {"$exists": False}}

def pt_perspective(persp_type, persp_value):
    '''perspective for a single project or tag'''
    return {persp_type: persp_value}

def custom_tags_perspective(and_tags, any_tags, not_tags):
    persp = {"$and":[]}

    # and
    persp["$and"].append({"tags": {"$all":and_tags}})

    # any
    persp["$and"].append({"$or":[]})
    for any_tag in any_tags:
        persp["$and"][-1]["$or"].append({"tags": any_tag})

    # not
    persp["$and"].append({"$nor": []})
    for not_tag in not_tags:
        persp["$and"][-1]["$nor"].append({"tags": not_tag})

    return persp

if __name__ == '__main__':
    t = MongoClient().simplethings.things
    def display(persp):
        for i in t.find(persp):
            print(i)
