import os

settings = {
    'host': os.environ.get('ACCOUNT_HOST', ''),
    'master_key': os.environ.get('ACCOUNT_KEY', ''),
    'database_id': os.environ.get('COSMOS_DATABASE', ''),
    'container_id': os.environ.get('COSMOS_CONTAINER', ''),
    'blob_connection_string': os.environ.get('BLOB_CONN_STRING', "")
}

user_credentials = {
    'username': os.environ.get('DEFAULT_UNAME', ''),
    'password': os.environ.get('DEFAULT_PASS', '')
}