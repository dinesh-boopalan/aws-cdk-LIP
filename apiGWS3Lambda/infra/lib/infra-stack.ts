import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lamdba from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'InfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    //S3 bucket
    const dincdks3bucket = new s3.Bucket(this,'dincdks3bucketLogicalId',{
      bucketName:'dinbalancestatus0125'
    }    )

    // IAM role
    const diniamrolecdk = new iam.Role(this,'diniamrolecdkLogicalId',{
      roleName: 'dincdkdemo',
      description: 'Role for lambda to access s3 files',
      //Provide the main service details
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    })
      // inherit existing policy
      diniamrolecdk.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));

      // Lambda function

      const dinlambdacdk = new lamdba.Function(this,'dinlambdacdkLogialId',{
        handler: 'lambda_function.lambda_handler',
        runtime: lamdba.Runtime.PYTHON_3_9,
        code: lamdba.Code.fromAsset('../services/'),
        role: diniamrolecdk
      })
      //API gateway
      const dinapigateway = new apigateway.LambdaRestApi(this, 'dinapigatewayLogicalId',{
      handler: dinlambdacdk,
      restApiName:'bankingrestapi',
      deploy:true,
      proxy:false
    })
    const bankstatus = dinapigateway.root.addResource('bankstatus');
    bankstatus.addMethod('GET');
  }
}
