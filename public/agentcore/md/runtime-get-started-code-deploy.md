# Get started with Amazon Bedrock AgentCore Runtime direct code deployment - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-code-deploy.html

---

# Get started with Amazon Bedrock AgentCore Runtime direct code deployment

Direct code deployment enables you to bring your agent to Amazon Bedrock AgentCore Runtime simply by packaging agent code and its dependencies in a .zip file archive. Your agent still needs to follow [AgentCore Runtime requirements](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-service-contract.html>).

To create your deployment package as .zip file archive, you can use [AgentCore CLI](<https://github.com/aws/agentcore-cli>) or follow the steps in the language-specific guides below, or any other .zip file utility such as [7zip](<https://www.7-zip.org/download.html>) . The examples shown in the following sections assume you’re using a command-line `zip` tool in a Linux or MacOS environment. To use the same commands in Windows, you can [install the Windows Subsystem for Linux](<https://docs.microsoft.com/en-us/windows/wsl/install-win10>) to get a Windows-integrated version of Ubuntu and Bash.

Note that AgentCore Runtime uses POSIX file permissions, so you may need to [set permissions for the deployment package folder](<http://aws.amazon.com/premiumsupport/knowledge-center/lambda-deployment-package-errors/>) before you create the .zip file archive.

###### Topics

  * Direct code deployment concepts

  * [Direct code deployment for Python](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-get-started-code-deploy-python.html>)

  * [Direct code deployment for Node.js](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-get-started-code-deploy-node.html>)

  * [Supported language runtimes and deprecation policy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-code-deploy-supported-runtimes.html>)

  * [Troubleshooting direct code deployment](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-code-deploy-common-issues.html>)


## Direct code deployment concepts

Learn about key concepts when using direct code deployment with Amazon Bedrock AgentCore Runtime.

###### Topics


Amazon Bedrock AgentCore Runtime with direct code deployment uses a shared responsibility model similar to AWS Lambda. AgentCore Runtime manages the language runtime environment and applies security patches automatically, while you focus on your agent code and dependencies.

If you’re using [container images to deploy your agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/getting-started-custom.html>) , then AgentCore Runtime is responsible to patch only compute kernel. In this case, you’re responsible for rebuilding your agent’s container image from the latest secure image and redeploying the container image.

This is summarized in the following table:

Deployment mode | AgentCore Runtime’s responsibility | Your responsibility  
---|---|---  
Direct deploy mode |  Publish new language runtime version containing the latest patches for language runtime. Apply language runtime patches to existing AgentCore Runtime direct deploy. |  Update your agent code, including dependencies, to address any security vulnerabilities.  
Container image |  Automatically patch underlying compute OS kernel with latest version. |  Update your agent code, including dependencies, to address any security vulnerabilities. Regularly re-build and re-deploy your container image using the latest base image.  
  
For more information about shared responsibility with AWS, see [Shared Responsibility Model](<https://aws.amazon.com/compliance/shared-responsibility-model/>).

AgentCore Runtime keeps each direct code deploy runtime up to date with security updates, bug fixes, new features, performance enhancements, and support for minor version releases. These runtime updates are published as _runtime versions_ . AgentCore Runtime applies direct code deploy runtime updates to agents by migrating the agents from an earlier runtime version to a new runtime version.

For direct deploy runtimes, AgentCore Runtime applies runtime updates automatically. With automatic runtime updates, AgentCore Runtime takes on the operational burden of patching the runtime versions. For most customers, this should be a safe choice as only language runtime patches will be automatically applied and customers are responsible to bring and managed their code dependencies. Currently AgentCore Runtime doesn’t support changing this automated patching behavior.

AgentCore Runtime strives to provide runtime updates that are backward compatible with existing functions. However, as with software patching, there are rare cases in which a runtime update can negatively impact an existing function. For example, security patches can expose an underlying issue with an existing function that depends on the previous, insecure behavior. If in extremely rare cases this risk is not acceptable, please use [container images to deploy your agent](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/getting-started-custom.html>).

Some of the dimensions of comparison to see how one option differs from the other, so it helps to choose the right option

  * **Deployment Process** : Direct code deployment deploys agents using ZIP files instead of containers, lending itself to faster development iterations.

  * **Deployment time** : Although there is not much difference during first deployment of an agent, subsequent updates to the agent are significantly faster with direct code deployment.

  * **Customization** : Direct code supports for custom dependencies through ZIP-based packaging while maintaining deployment simplicity while container based depends on a Docker file.

  * **Package size** : Direct code deployment limits the package size to 250MB whereas container based packages can be upto 2GB in size.

  * **Session creation rate** : The direct code deployment allows for higher session creation of 25 new sessions/second compared to 1.6 new sessions/second with container based deployments.


Our general guidance is

  * If the size of the deployment package exceeds 250MB, and you have existing container CI/CD pipelines, and you need highly specialized dependencies and packaging, then container based deployments is a good option to choose.

  * If the size of the deployment package is small, the code and package is not complex to build and uses common frameworks and languages, and you need rapid prototyping and iteration, then direct code deployment would be the option.


There can also be a hybrid option where developers use the direct code deployment to quickly experiment and prototype agents and then switch to container based deployments (for the above reasons) to develop, test and deploy to production.

