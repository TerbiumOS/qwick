var Metafile = JSON.parse(await Filer.fs.promises.readFile("/system/qwick/Metafile", "utf8"));
var filesRoot = "https://raw.githubusercontent.com/TerbiumOS/qwick/refs/heads/main/qwick";
var qwickRoot = Metafile.root;
var filetableRaw = await tb.libcurl.fetch(`https://raw.githubusercontent.com/TerbiumOS/qwick/refs/heads/main/installer/filetable.json?ts=${Date.now()}`);
var filetable = await filetableRaw.json();
var filetableKeys = Object.keys(filetable);
for (let i = 0; i < filetableKeys.length; i++) {
    let src = filetableKeys[i];
    let dest = filetable[filetableKeys[i]].replace("$ROOT", qwickRoot);
    let raw = await tb.libcurl.fetch(`${filesRoot}${src}?ts=${Date.now()}`);
    let content = await raw.text();
    await Filer.fs.promises.writeFile(dest, content);
}
var TerminalCommands = JSON.parse(await Filer.fs.promises.readFile("/apps/system/terminal.tapp/scripts/info.json"));
var QwickCommand = { name: "qwick", description: "Qwick package manager", usage: "qwick [subcmd] [subcmd] ... <input?> <args?>" };
const alreadyExists = TerminalCommands.some(cmd => cmd.name === QwickCommand.name);
if (!alreadyExists) TerminalCommands.push(QwickCommand);