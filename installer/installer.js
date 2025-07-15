var test = await Filer.fs.promises.readFile("/system/qwick/Metafile", "utf8");
displayOutput(JSON.stringify(test, null, 2));