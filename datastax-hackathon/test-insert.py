from astrapy.rest import create_client, http_methods
import uuid
import os
import json

# get Astra connection information from environment variables
ASTRA_DB_ID = os.environ.get('ASTRA_DB_ID')
ASTRA_DB_REGION = os.environ.get('ASTRA_DB_REGION')
ASTRA_DB_APPLICATION_TOKEN = os.environ.get('ASTRA_DB_APPLICATION_TOKEN')
ASTRA_DB_KEYSPACE = "user_data"
# ASTRA_DB_COLLECTION = "test"
ASTRA_DB_COLLECTION = "session_data"


with open("session-data.json", "r") as f:
    data = json.load(f)

# setup an Astra Client
astra_http_client = create_client(astra_database_id=ASTRA_DB_ID,
                         astra_database_region=ASTRA_DB_REGION,
                         astra_application_token=ASTRA_DB_APPLICATION_TOKEN)

# create a document on Astra using the Document API
counter = 0
for x in data:
    doc_uuid = uuid.uuid4()
    astra_http_client.request(
        method=http_methods.PUT,
        path=f"/api/rest/v2/namespaces/{ASTRA_DB_KEYSPACE}/collections/{ASTRA_DB_COLLECTION}/{doc_uuid}",
        json_data=x)
    print(counter)
    counter += 1


# doc_uuid = uuid.uuid4()
# astra_http_client.request(
#     method=http_methods.PUT,
#     path=f"/api/rest/v2/namespaces/{ASTRA_DB_KEYSPACE}/collections/{ASTRA_DB_COLLECTION}/{doc_uuid}",
#     json_data=data)

# print(data)