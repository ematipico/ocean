export const usage = `
Usage
	$ ocean

Options
	--gateway-key, -g   The API Gateway key of the project. Default is "Terranext"
	--next-app-dir, -d  The path that Terraform CLI has to follow to reach the nextjs project.
	--provider          The Cloud provider to use when exporting the configuration
	--env								A way for passing environment variables to the lambdas
		
Examples
	$ ocean 
	$ ocean --gateway-key=CustomKey --next-app-dir=../../nextjs-project/
	$ ocean --provider=AWS --next-app-dir=../../nextjs-project/
	$ ocean -g=CustomKey -d=../../nextjs-project/
	$ ocean --env="DEBUG,express:*"
`;
