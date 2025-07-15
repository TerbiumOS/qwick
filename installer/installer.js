var Metafile = JSON.parse(await Filer.fs.promises.readFile("/system/qwick/Metafile", "utf8"));
var Lockfile = JSON.parse(await Filer.fs.promises.readFile("/system/qwick/Lockfile", "utf8"));
var filesRoot = "https://raw.githubusercontent.com/TerbiumOS/qwick/refs/heads/main/qwick";
var qwickRoot = Metafile.root;

var filetableRaw = tb.libcurl.fetch("https://raw.githubusercontent.com/TerbiumOS/qwick/refs/heads/main/qwick")
