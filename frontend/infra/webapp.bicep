
var location = resourceGroup().location
@secure()
param githubToken string

var webappName = 'mterms-react-node-swa'

resource webApp 'Microsoft.Web/staticSites@2020-12-01' = {
  name: webappName
  location: location
  tags: {}
  properties: {
    repositoryUrl: 'https://github.com/kaffikaffi/mterms-web'
    branch: 'master'
    repositoryToken: githubToken
    buildProperties: {
      appLocation: '/'
      apiLocation: 'api'
      outputLocation: 'build'
      appBuildCommand: 'npm run build'
      apiBuildCommand: 'npm run build'
      skipGithubActionWorkflowGeneration: false
    }
    stagingEnvironmentPolicy: 'Enabled'
  }
  sku: {
    name: 'Free'
  }
}
