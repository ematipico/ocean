export interface EnvironmentVariables {
	[x: string]: string;
}

export interface ProviderOptions {
	runtimeVersion?: '10' | '12';
	gatewayKey?: string;
	memorySize?: string;
	timeout?: string;
	environmentVariables?: EnvironmentVariables;
}
