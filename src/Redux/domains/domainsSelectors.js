const getDomainsList = state => state.domains.domainsList
const getDomainsCount = state => state.domains.domainsCount

const getDomainsFiltersList = state => state.domains.domainsFiltersList
const getDomainsFilters = state => state.domains.domainsFilters

const getIsLoadingDomains = state => state.domains.isLoadingDomains

export default {
  getDomainsList,
  getDomainsCount,
  getDomainsFiltersList,
  getDomainsFilters,
  getIsLoadingDomains
}
