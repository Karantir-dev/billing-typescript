const getUsers = state => state.users.users
const getRights = state => state.users.rights
const getIsLoadingTrusted = state => state.users.isLoadingTrusted

export default {
  getUsers,
  getRights,
  getIsLoadingTrusted,
}
