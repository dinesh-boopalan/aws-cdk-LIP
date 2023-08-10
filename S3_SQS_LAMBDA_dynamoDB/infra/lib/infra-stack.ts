import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications'; 
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'InfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

        // Iam role
    const dinIamRoleCdk = new iam.Role(this,'RoleLogicalId',{
      roleName: 'inventoryfeed01role',
      description: 'Iam role for lambda',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
      });
      // Add the polices needed to grant respective access.
      dinIamRoleCdk.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));
     // dinIamRoleCdk.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSLambda_FullAccess'));
      dinIamRoleCdk.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));
      dinIamRoleCdk.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchFullAccess'));

      // Lambda 
      const dinlambdacdkstack = new lambda.Function(this,'lambdaLogicalId',{
        handler: 'lambda_function.lambda_handler',
        role: dinIamRoleCdk,
        runtime: lambda.Runtime.PYTHON_3_9,
        code: lambda.Code.fromAsset('../services/')
      })

      // Adding dependecncy of IAM role to Lambda function
      dinlambdacdkstack.node.addDependency(dinIamRoleCdk)

      //Creating S3 bucket
      const dins3cdk = new s3.Bucket(this,'s3logicalID',{
        bucketName: 'dincdkdemo-bankingbucket011'
      })
      // S3 Event notification when a object is created
      // Synax
      //      role.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(fn));

      dins3cdk.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(dinlambdacdkstack));

      //DynamoDB config
      const dindynamodb = new dynamodb.Table(this,'dindynamodblogicalid',{
        tableName: 'retaildynamodbtable',
        partitionKey: {name:'customername',type:dynamodb.AttributeType.STRING}
      })
  }
}
