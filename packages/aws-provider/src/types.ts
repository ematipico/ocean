import { GeneratedLambdaProperties } from './resources/Lambda/LambdaProperties';

export interface GatewayResources {
	resource: {
		aws_api_gateway_resource: AWS.Resource;
		aws_api_gateway_method: AWS.Method;
		aws_api_gateway_integration: AWS.Integration;
	};
	variable: {
		integrationList: {
			default: string[];
		};
	};
}

export declare namespace AWS {
	interface Method {
		[key: string]: AWS.GatewayMethod;
	}

	interface Resource {
		[key: string]: AWS.GatewayResource;
	}

	interface Integration {
		[key: string]: AWS.GatewayIntegration;
	}

	interface RequestParameter {
		[key: string]: string;
	}

	interface LambdaFunction {
		[key: string]: AWS.Function;
	}

	interface Lambdas {
		aws_lambda_function: LambdaFunction;
		aws_lambda_permission: AWS.LambdaPermission;
	}

	interface LambdaData {
		[key: string]: AWS.Data;
	}

	interface Data {
		output_path: string;
		type: string;
		source_dir: string;
	}

	interface Function {
		filename: string;
		function_name: string;
		source_code_hash: string;
		handler: string;
		runtime: string;
		memory_size: string;
		timeout: string;
		role: string;
		environment?: Environment;
	}

	interface Environment {
		variables: {
			[key: string]: string;
		};
	}

	interface LambdaPermission {
		[key: string]: Permission;
	}

	interface Permission {
		statement_id: string;
		action: string;
		function_name: string;
		principal: string;
		source_arn: string;
	}

	interface LambdaResources {
		resource?: AWS.Lambdas;
		data: {
			archive_file: AWS.LambdaData;
		};
	}
}

export interface Param {
	name: string;
	mandatory?: boolean;
}

export interface AwsGatewayOptions {
	parentId?: string;
	id: string;
	isUrlParameter?: boolean;
	pathname: string;
	params?: Param[];
	queryStringParams?: Param[];
	lambdaName: string;
}

export interface GenerateGatewayResource {
	uniqueId: string;
	resource: AWS.GatewayResource;
}

export interface HandleResource {
	pathPart: string;
	index: number;
	parts: string[];
	route: string;
	lambdaName: string;
	params: Param[];
}

export interface GenerateGatewayResourcePayload {
	id: string;
	pathname: string;
	parentId?: string;
	isUrlParam?: boolean;
}

export interface GenerateGatewayIntegrationPayload {
	id: string;
	gatewayResourceId: string;
	lambdaName: string;
	params?: Param[];
	queryStringParams?: Param[];
}

export interface GenerateGatewayMethodPayload {
	uniqueName: string;
	gatewayResourceId: string;
	params?: Param[];
	queryStringParams?: Param[];
}

export interface LambdaOptions {
	id: string;
	directoryName: string;
}
