module.exports = {};
module.exports.getRepoList = async (Filer) => {
    let repolist = await Filer.fs.promises.readFile("/system/qwick/repo-list.json");
    return repolist;
}