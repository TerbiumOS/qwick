var Metafile = JSON.parse(await Filer.fs.promises.readFile("/system/qwick/Metafile", "utf8"));
var filesRoot = "https://terbiumos.github.io/qwick/qwick";
var qwickRoot = Metafile.root;
displayOutput("Searching for files to install...")
var filetableRaw = await tb.libcurl.fetch(`https://terbiumos.github.io/qwick/installer/filetable.json?ts=${Date.now()}`);
var filetable = await filetableRaw.json();
var filetableKeys = Object.keys(filetable);
displayOutput("Using filetable.json for file mapping");
for (let i = 0; i < filetableKeys.length; i++) {
    let src = filetableKeys[i];
    let dest = filetable[filetableKeys[i]].replace("$ROOT", qwickRoot);
    let raw = await tb.libcurl.fetch(`${filesRoot}${src}?ts=${Date.now()}`);
    let content = await raw.text();
    await Filer.fs.promises.writeFile(dest, content);
    displayOutput(`Installed file ${filesRoot}${src} to ${dest}`);
};