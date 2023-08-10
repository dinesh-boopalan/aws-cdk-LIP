import json
import boto3

client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event,context):
    response = client.get_object(
        Bucket = 'dincdkdemo-bankingbucket011',
        Key ='cdktestfile.json'
    )
    
    json_data = response['Body'].read()

    data_string = json_data.decode('utf-8')

    data_dict = json.loads(data_string)
    print(data_dict)
    print(type(data_dict))


    # insert data to dynamodb
    table = dynamodb.Table('retaildynamodbtable')
    table.put_item(Item=data_dict)
