var moduleCache = {};
async function requireModule(id) {
    if (moduleCache[id]) return moduleCache[id];
    const file = await Filer.fs.promises.readFile(`/system/qwick/coredeps/${id}.js`, 'utf8');
    const mod = {};
    const wrapper = new Function('module', 'exports', file);
    wrapper(mod, mod.exports = {});
    moduleCache[id] = mod.exports;
    return mod.exports;
}
const ver = "1.0.1";
var cmdData = {
    help: {
        desc: "Shows information about a given subcommand",
        usage: "qwick help <subcmd> ...",
        args: {
            subcmd: "The subcommand to look up. I.e. tb help system version",
        },
    },
	update: {
		desc: "Updates qwick",
		usage: "qwick update"
	}
};
async function qwick(args) {
    function error(err) {
        displayError(`${err}\n`);
        createNewCommandInput();
    }
    function help(args) {
        function resolveCommand(args) {
            let current = cmdData;
            for (let i = 1; i < args.length; i++) {
                const input = args[i];
                const scope = current.subcmds || current;
                const match = Object.entries(scope).find(([key, val]) => key === input || val.alias === input);
                if (!match) {
                    displayOutput(`Unknown command or alias: ${input}`);
                    return null;
                }
                current = match[1];
            }
            if (args.length === 1) {
                current.v = true;
            }
            return current;
        }
        function formatData(info) {
            if (typeof info.v === "undefined") {
                displayOutput(`Description: ${info.desc}\n`);
                displayOutput(`USAGE: ${info.usage}`);
                if (info.alias) displayOutput(`ALIAS(ES): ${info.alias}\n`);
                if (info.subcmds) {
                    displayOutput("SUBCOMMANDS:");
                    const subkeys = Object.keys(info.subcmds);
                    for (let i = 0; i < subkeys.length; i++) {
                        displayOutput(
                            `${`${subkeys[i]} ${info.subcmds[subkeys[i]].alias ? `(alias: ${info.subcmds[subkeys[i]].alias})` : ""}`.padEnd(40)}${info.subcmds[subkeys[i]].desc}\n`
                        );
                    }
                } else if (info.args) {
                    displayOutput("ARGUMENTS:");
                    const subkeys = Object.keys(info.args);
                    for (let i = 0; i < subkeys.length; i++) {
                        displayOutput(`${`${subkeys[i]}`.padEnd(40)}${info.args[subkeys[i]]}\n`);
                    }
                }
            } else {
                delete info.v;
                displayOutput('Any commands listed as "parent" commands have subcommands. Use `tb help <cmd>` to view it\'s commands.');
                displayOutput("List of available commands:\n");
                const cmdKeys = Object.keys(cmdData);
                for (let i = 0; i < cmdKeys.length; i++) {
                    displayOutput(
                        `${`${cmdKeys[i]} ${cmdData[cmdKeys[i]].alias ? `(alias: ${cmdData[cmdKeys[i]].alias})` : ""}`.padEnd(40)}${cmdData[cmdKeys[i]].desc}\n`
                    );
                }
            }
        }
        const data = resolveCommand(args);
        if (data != null) {
            formatData(data);
        }
        displayOutput(`Qwick v${ver}`);
        createNewCommandInput();
    };
    switch (args._[0]) {
        case undefined:
        case null:
            help(["help"]);
            break;
        case "help":
            help(args._);
            break;
        case "update": {
            let updater = await requireModule("updater");
            updater.updater(terbium, Filer, displayOutput, displayError);
            createNewCommandInput();
            break;
        }
        default:
            error(`qwick > unknown subcommand: ${args._[0]}`);
            break;
    }
}
qwick(args, term);
