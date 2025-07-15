var test = await Filer.fs.promises.readFile("/system/qwick/Metafile");
displayOutput(JSON.stringify(test, null, 2));