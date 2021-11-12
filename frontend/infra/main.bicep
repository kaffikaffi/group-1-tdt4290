targetScope='resourceGroup'


var keyVaultName = 'mterms-kv'
resource keyVault 'Microsoft.KeyVault/vaults@2019-09-01' existing = {
  name: keyVaultName
}


module webApp 'webapp.bicep' = {
  name:'static-webapp'
  params:{
    githubToken: keyVault.getSecret('githubToken')
  }
}
