module.exports = {};
module.exports.updater = async (terbium, Filer, displayOutput, displayError) => {
    var Metafile = JSON.parse(await Filer.fs.promises.readFile("/system/qwick/Metafile", "utf8"));
    var version = Metafile.version;
    var remoteVersionRaw = await terbium.libcurl.fetch(`https://terbiumos.github.io/qwick/version?ts=${Date.now()}`);
    var remoteVersion = (await remoteVersionRaw.text()).trim();
    if (version.trim() != remoteVersion) {
        displayOutput("Updating Qwick...");
        const installerRaw = await terbium.libcurl.fetch(`https://terbiumos.github.io/qwick/installer/installer.js?ts=${Date.now()}`);
        const installerBody = await installerRaw.text();
        const wrappedInstallerBody = `(async (tb, Filer, displayOutput, displayError) => {\n${installerBody}\n})`;
        const installerFn = eval(wrappedInstallerBody);
        await installerFn(terbium, Filer, displayOutput, displayError);
        displayOutput("Writing update to Metafile");
        Metafile.version = remoteVersion;
        await Filer.fs.promises.writeFile("/system/qwick/Metafile", JSON.stringify(Metafile, null, 2));
        displayOutput(`Finished updating Qwick to v${remoteVersion}`);
    } else {
        displayOutput("No new qwick version available");
    }
}