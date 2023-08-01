import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch'
export class DemoInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'DemoInfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // Lambda function
    const demoLambdaCDk = new lambda.Function(this,'demolambdacdk',{
      handler: 'lambda_function.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset('../services/'),
      functionName: 'demolambdacdk'
    })
    //Cloud Watch alaram
    const democloudwatch = new cloudwatch.Alarm(this,'cloudWatchLogicalId',{
      evaluationPeriods: 1,
      threshold: 1,
      metric: demoLambdaCDk.metricErrors()
    })
  }
}
