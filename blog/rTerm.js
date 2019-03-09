/*
 * Just a tool for links representation
 * Needs a JQuery
 */
rTerm = function (options) {
    // A link to JSON with fs and cmd responses
    this.file = options.file;
    // An id of div where to place the terminal
    this.divid = options.div || 'rterm';
    // Username
    this.username = options.username || 'user';
    // Hostname
    this.hostname = options.hostname || 'hostname';
    // Starting path in fs
    this.fsstart = options.fsstart || "/home/" + this.username;
    // High of the terminal
    this.height = options.height || 400;
    // Maximal number of strings
    this.maxStrings = options.maxStrings || 15;
    // Save string to server
    this.saveStrings = options.saveStrings || false;
    // Logger app port
    this.loggerAppPort = options.loggerAppPort || 9091;
    // How much commands should be stored at history
    this.maxHistoryLength = options.maxHistoryLength || 20;
    // How much time might take to print one character [ms]
    this.chartime = 250;
    // Current dirrectory
    this.cdir = this.fsstart;
    this.uhsername = this.username + '@' + this.hostname;

    this.data = {};
    this.clicked = false;

    // Load data, call upstart commands and set callbacks
    this.init = function() {
        $.getJSON(this.file, (function(data) {
            this.data = data;

            window.onblur = function() {
                window.blurred = true;
            };
            window.onfocus = function() {
                window.blurred = false;
            };

            if (this.data.upstart !== "undefined") {
                var delay = this.callUpstart();

                setTimeout(function() {
                    $(document).keydown(this.keyCallback);
                }, delay);
            } else {
                $(document).keydown(this.keyCallback);
            }
        }).bind(this));

        $("#" + this.divid).html(
          '<div id="term"> <span id="termcli">' + this.termPrev +
          '</span><span class="cursor">&#9608</span></div>'
        );
    };

    this.termPrev = '<b>' + this.uhsername + '</b>:~$  '
    this.oldInput = ''
    this.input = '';
    this.nStrings = 0;
    this.commandHistory = [];
    this.commandHistoryIterator = 0;

    // Call initial commands from data.upstart with typing delays
    this.callUpstart = function () {
        var delay = 0;
        this.upcid = 0;
        this.upstartInterrupted = false;

        for (cid in this.data.upstart) {
            if (cid > 0) {
                delay += (this.data.upstart[cid - 1].length + 1) * this.chartime;
            }
            setTimeout(function() {
                if (window.blurred && !this.upstartInterrupted) {
                    this.callUpstartImmediately(this.data.upstart.slice(this.upcid));
                    this.upstartInterrupted = true;
                    return;
                }
                else if (!this.upstartInterrupted) {
                    this.enterCommand(this.data.upstart[this.upcid]);
                }
                this.upcid++;
            }, delay);
        }
        delay += (this.data.upstart[this.data.upstart.length - 1].length + 1) * this.chartime;
        return delay;
    };

    // Call upstart commands without delays
    this.callUpstartImmediately = function (commands) {
        for (c of commands) {
            this.enterCommandImmediately(c);
        }
    };

    // Enter command with typing delays
    this.enterCommand = function (command) {
        this.currlid = 0;
        this.interruptCommand = false;

        for (lid in command) {
            setTimeout(function() {
                if (window.blurred && !this.interruptCommand) {
                    this.enterCommandImmediately(command.slice(this.currlid));
                    this.interruptCommand = true;
                    return;
                } else if (!this.interruptCommand) {
                    this.addCallback(command[this.currlid]);
                }
                this.currlid++;
            }, this.chartime * lid);
        }
        setTimeout(function() {
            if (!this.interruptCommand) {
                this.enterCallback();
            }
        }, this.chartime * command.length);
    };

    // Enter command without delays
    this.enterCommandImmediately = function (command) {
        for (l of command) {
            this.addCallback(l);
        }
        this.enterCallback();
    };

    // Update #termcli with new input
    this.updateTerm = function () {
        $("#termcli").html(this.oldInput + this.termPrev + this.input);
        while ($("#term").height() > this.height)
        {
            this.delFristString();
            $("#termcli").html(this.oldInput + this.termPrev + this.input);
        }
    };

    // Delete the oldest sting
    this.delFristString = function () {
        var cutPos = this.oldInput.indexOf("<br>");
        this.oldInput = this.oldInput.slice(cutPos + 4, -4) + '<br>';
        this.nStrings--;
    };

    this.keyCallback = (function(event) {
        if (event.key.length == 1) {
            this.addCallback(event.key);
        } else if (event.which == 8 || event.which == 46 ||
                   event.which == 110) {
            this.delCallback();
        } else if (event.which == 13) {
            this.enterCallback();
        } else if (event.which == 38) {
            this.upCallback();
        } else if (event.which == 40) {
            this.downCallback();
        }
    }).bind(this);

    // Add character to input
    this.addCallback = (function (key) {
        this.input += key;
        this.updateTerm();
    }).bind(this);

    // Delete last character from input
    this.delCallback = (function () {
        this.input = this.input.slice(0, -1);
        this.updateTerm();
    }).bind(this);

    // Call command from input
    this.enterCallback = (function () {
        if (this.input == '')
        {
            this.emptyCallback();
        }
        else
        {
            if (this.saveStrings)
            {
                this.sendString(this.input);
            }
            this.commandHistoryIterator = 0;
            this.commandHistory.unshift(this.input);
            if (this.commandHistory.length > this.maxHistoryLength)
            {
                this.commandHistory.pop();
            }
            var args = this.input.split(" ");
            if (args[0] in this.funcMap)
            {
                this.funcMap[args[0]](args);
            }
            else
            {
                this.unknownCallback();
            }
        }
    }).bind(this);

    // Show previous command from history
    this.upCallback = (function() {
      if (this.commandHistoryIterator < this.commandHistory.length - 1)
      {
          this.commandHistoryIterator++;
      }
      this.input = this.commandHistory[this.commandHistoryIterator];
      this.updateTerm();
    }).bind(this);

    // Show next command from history
    this.downCallback = (function() {
      if (this.commandHistoryIterator > 0)
      {
          this.commandHistoryIterator--;
      }
      this.input = this.commandHistory[this.commandHistoryIterator];
      this.updateTerm();
    }).bind(this);

    /*
     * Call empty command
     */
    this.emptyCallback = (function() {
        this.oldInput += this.termPrev + this.input + '<br>';
        this.nStrings++;
        this.updateTerm();
    }).bind(this);

    /*
     * Call unknown command
     */
    this.unknownCallback = (function() {
        this.oldInput += this.termPrev + this.input + '<br>' + this.input + ": command not found" + '<br>';
        this.input = '';
        this.nStrings += 2;
        this.updateTerm();
    }).bind(this);

    // Send string to logger
    this.sendString = (function(cli_input) {
        $.ajax({
                url: "https://" + window.location.hostname + ":" + this.loggerAppPort + "?" + cli_input,
                dataType: 'jsonp'
            });
    }).bind(this);

    // Get object by path
    this.getByPath = (function(dstname) {
        var path = '';
        if (dstname.startsWith("/")) {
            path = dstname;
        } else if (dstname.startsWith("~")) {
            path = this.fsstart + "/" + dstname.slice(1);
        } else {
            path = this.cdir + "/" + dstname;
        }
        if (path.endsWith("/")) {
            path = path.slice(0, -1);
        }
        var pathArray = path.split("/").slice(1);
        var newPathArray = [];
        for (i in pathArray) {
            if (pathArray[i] == "..") {
                if (newPathArray.length > 0) {
                    newPathArray.splice(-1, 1);
                } else {
                    continue;
                }
            } else if (pathArray[i] == ".") {
                continue;
            } else {
                newPathArray.push(pathArray[i]);
            }
        }
        path = "/" + newPathArray.join("/");
        var data = this.data.fs;
        for (folder of newPathArray) {
            data = data[folder];
        }
        return [data, path];
    }).bind(this);

    /*
     * List files in the directory
     * Usage: ls [OPTION]... [FILE]...
     * Options:
     *    -a    do not ignore entries starting with .
     *    -l    use a long listing format [TODO]
     */
    this.lsCallback = (function(args) {
        this.oldInput += this.termPrev + this.input + '<br>';
        this.nStrings++;

        var all = false;
        var list = false;

        var lsdir = this.cdir;

        for (arg of args.slice(1)) {
            if (!arg.startsWith("-")) {
                if (arg.startsWith("/")) {
                    lsdir = arg;
                } else {
                    lsdir = lsdir + "/" + arg;
                }
            } else {
                if (arg == "-a") {
                    all = true;
                } else if (arg == "-l") {
                    list = true;
                }
            }
        }
        var dirData = this.getByPath(lsdir)[0];
        if (typeof dirData === "undefined") {
            this.oldInput += "ls: cannot access '" + lsdir + "': No such file or directory" + '<br>';
            this.nStrings++;
        } else {
            for (item in dirData) {
                if (!item.startsWith('.') || all)
                {
                    if (typeof dirData[item] === 'string') {
                        if (dirData[item].startsWith("_link:")) {
                            this.oldInput += '<a class="link" href="' + dirData[item].slice(6, ) + '" target="_blank">' + item + '</a><br>';
                        } else {
                            this.oldInput += item + '<br>';
                        }
                    } else {
                        this.oldInput += '<font color="#729FCF">' + item + '</font><br>';
                    }
                    this.nStrings++;
                }
            }
        }
        this.input = '';
        this.updateTerm();
    }).bind(this);

    /*
     * Concatenate FILE to standard output.
     * Usage: cat [OPTION]... [FILE]...
     */
    this.catCallback = (function(args) {
        var data = this.getByPath(args[1])[0];
        if (data == '' || typeof data === 'undefined') {
            this.oldInput += this.termPrev + this.input + '<br>' + this.input + ": No such file or directory" + '<br>';
        } else {
            if (data.startsWith("_call:")) {
                var args = data.slice(6, ).split(" ");
                if (args[0] in this.funcMap) {
                    this.funcMap[args[0]](args);
                    return;
                } else {
                    this.oldInput += this.termPrev + this.input + '<br>' + data + '<br>';
                }
            } else {
                this.oldInput += this.termPrev + this.input + '<br>' + data + '<br>';
            }
        }

        this.input = '';
        this.nStrings += 2;
        this.updateTerm();
    }).bind(this);

    /*
     * If DIR is a directory: change current working directory to DIR;
     * if DIR is a link: open URL in a new tab.
     * Usage: cd [DIR]
     */
    this.cdCallback = (function(args) {
        var dstname = '';
        if (args.length < 2 || args[1] == " ") {
            dstname = "~";
        } else {
            dstname = args[1];
        }
        var [data, path] = this.getByPath(dstname);
        if (typeof data === 'undefined') {
            this.oldInput += this.termPrev + this.input + '<br>' + this.input + ": No such file or directory" + '<br>';
            this.input = '';
            this.nStrings += 2;
        } else if (typeof data === 'string') {
            if (data.startsWith("_link:")) {
                this.oldInput += this.termPrev + this.input + '<br>';
                this.input = '';
                this.nStrings++;
                window.open(data.slice(6, ), '_blank').focus();
            } else {
                this.oldInput += this.termPrev + this.input + '<br>' + this.input + ": Not a directory" + '<br>';
                this.input = '';
                this.nStrings += 2;
            }
        } else if (typeof data === 'object') {
            this.cdir = path;
            this.oldInput += this.termPrev + this.input + '<br>';
            this.input = '';
            this.nStrings++;

            var pathPref = this.cdir;
            if (pathPref == this.fsstart) {
                pathPref = '~';
            }

            this.termPrev = '<b>' + this.uhsername + '</b>:' + pathPref + '$  ';
        }
        this.updateTerm();
        return;
    }).bind(this);

    /*
     * Show full pathname of the current working directory
     * Usage: pwd
     */
    this.pwdCallback = (function(args) {
      this.oldInput += this.termPrev + this.input + '<br>' + this.cdir + '<br>';
      this.input = '';
      this.nStrings += 2;
      this.updateTerm();
    }).bind(this);

    /*
     * Show whoami info from this.data.whoami
     * Usage: whoami
     */
    this.whoamiCallback = (function() {
        this.oldInput += this.termPrev + this.input + '<br>';
        this.nStrings++;

        for (item of this.data.whoami) {
            this.oldInput += item + '<br>';
            this.nStrings++;
        }
        this.input = '';
        this.updateTerm();
    }).bind(this);

    /*
     * Show uname info from this.data.uname
     * Usage: uname
     */
    this.unameCallback = (function() {
        this.oldInput += this.termPrev + this.input + '<br>' + this.data.uname + '<br>';
        this.input = '';
        this.nStrings += 2;
        this.updateTerm();
    }).bind(this);

    /*
     * Generate random float-pointed number in [0, 1)
     * Usage: random
     */
    this.randomCallback = (function() {
        this.oldInput += this.termPrev + this.input + '<br>' + String(Math.random()) + '<br>';
        this.input = '';
        this.nStrings += 2;
        this.updateTerm();
    }).bind(this);

    /*
     * Show all available commands list
     * Usage: help
     */
    this.helpCallback = (function() {
        this.oldInput += this.termPrev + this.input
                      + '<br>GNU bash, version 4.3.48(1)-release (x86_64-pc-linux-gnu)'
                      + '<br>These shell commands are defined internally.  Type "help" to see this list.<br><br>'
                      + '<br>cd [-L|[-P [-e]] [-@]] [dir]'
                      + '<br>echo [-neE] [arg ...] '
                      + '<br>exit [n]'
                      + '<br>help [-dms] [pattern ...]'
                      + '<br>time [-p] pipeline'
                      + '<br>times<br>';

        this.input = '';
        this.nStrings += 10;

        this.updateTerm();
    }).bind(this);

    /*
     * Exit console (deactivate keys callbacks)
     * Usage: exit
     */
    this.exitCallback = (function() {
        this.oldInput += this.termPrev + this.input + '<br>';
        this.nStrings++;

        $(document).unbind("keydown", this.keyCallback);

        this.input = '';
        this.updateTerm();
    }).bind(this);

    /*
     * Print the STRING passed as argument
     * Usage: echo [STRING]
     */
    this.echoCallback = (function() {
        var data = this.input.slice(5);
        this.oldInput += this.termPrev + this.input + '<br>' + data + '<br>';

        this.nStrings += 2;
        this.input = '';
        this.updateTerm();
    }).bind(this);

    /*
     * Just print hiii!
     * Usage: hi
     */
    this.hiCallback = (function() {
        this.oldInput += this.termPrev + this.input + '<br>hiii!<br>';
        this.nStrings += 2;
        this.input = '';
        this.updateTerm();
    }).bind(this);

    /*
     * Just print man page request
     * Usage: man
     */
    this.manCallback = (function() {
        this.oldInput += this.termPrev + this.input + '<br>What manual page do you want?<br>';
        this.nStrings += 2;
        this.input = '';
        this.updateTerm();
    }).bind(this);

    /*
     * Just type "Oh you!" and log out
     * Usage: ohyou
     */
     this.ohYouCallback = (function() {
         this.oldInput += this.termPrev + this.input + '<br>oh you!<br>';
         this.nStrings += 2;

         $(document).unbind("keydown", this.keyCallback);

         this.input = '';
         this.updateTerm();
     }).bind(this);

     /*
      * Clear screen and log out
      * Usage: poweroff
      */
    this.poweroffCallback = (function() {
        $(document).unbind("keydown", this.keyCallback);
        this.termPrev = '';
        this.oldInput = '';
        this.input = '';
        this.nStrings = 0;
        this.updateTerm();
    }).bind(this);

    /*
     * Clear screen
     * Usage: reboot
     */
    this.rebootCallback = (function() {
        $(document).unbind("keydown", this.keyCallback);
        setTimeout(function() {
           this.oldInput = '';
           this.input = '';
           this.nStrings = 0;
           this.updateTerm();
           $(document).keydown(this.keyCallback);
        }, 1000);
    }).bind(this);

    /*
     * Call COMMAND as superuser
     * Usage: sudo [COMMAND]
     */
    this.sudoCallback = (function(args) {
        if (args.length == 1) {
            this.oldInput += this.termPrev + this.input
                + '<br>usage: sudo [options] [command]<br>';
            this.nStrings += 2;
            this.input = '';
            this.updateTerm();
        } else if (args[1] in this.funcMap) {
            this.funcMap[args[1]](args.slice(1));
        }
        else {
            this.unknownCallback();
        }
    }).bind(this);

    /*
     * Imitates df
     * Usage df [OPTION]
     */
    this.dfCallback = (function(args) {
        this.oldInput += this.termPrev + this.input
            + '<br>Filesystem  1K-blocks  Used    Available  Use%  Mounted on'
            + '<br>/dev/sda1   514229     514229          0  100%  /boot<br>';
        this.nStrings += 3;
        this.input = '';
        this.updateTerm();
    }).bind(this);

    /*
     * Imitates apt
     * Usage apt [OPTION] [PACKET]
     */
    this.aptCallback = (function(args) {
        if (args.length == 1) {
            this.oldInput += this.termPrev + this.input
                + '<br>apt 1.2.34 (amd64)'
                + '<br>Usage: apt [options] command'
                + '<br>This APT has Super Cow Powers.<br>';
            this.nStrings += 4;
        } else if (args[1] == 'update') {
            this.oldInput += this.termPrev + this.input
                + '<br>Reading package lists... Done'
                + '<br>E: Could not open lock file /var/lib/apt/lists/lock - open (13: Permission denied)'
                + '<br>E: Unable to lock directory /var/lib/apt/lists/<br>';
            this.nStrings += 4;
        } else if (args[1] == 'upgrade') {
            this.oldInput += this.termPrev + this.input
                + '<br>E: Could not open lock file /var/lib/dpkg/lock - open (13: Permission denied)'
                + '<br>E: Unable to lock the administration directory (/var/lib/dpkg/), are you root?<br>';
            this.nStrings += 3;
        } else if (args[1] == 'install') {
            this.oldInput += this.termPrev + this.input
                + '<br>Reading package lists... Done'
                + '<br>Building dependency tree'
                + '<br>Reading state information... Done'
                + '<br>E: Unable to locate package ' + args[2] +'<br>';
            this.nStrings += 5;
        } else {
            this.oldInput += this.termPrev + this.input
                + '<br>E: Invalid operation ' + args[1] +'<br>';
            this.nStrings += 2;
        }
        this.input = '';
        this.updateTerm();
    }).bind(this);

    this.funcMap = {
        "ls": this.lsCallback,
        "cd": this.cdCallback,
        "cat": this.catCallback,
        "whoami": this.whoamiCallback,
        "uname": this.unameCallback,
        "help": this.helpCallback,
        "random": this.randomCallback,
        "pwd": this.pwdCallback,
        "exit": this.exitCallback,
        "echo": this.echoCallback,
        "hi": this.hiCallback,
        "man": this.manCallback,
        "ohyou": this.ohYouCallback,
        "fuck": this.ohYouCallback,
        "poweroff": this.poweroffCallback,
        "reboot": this.rebootCallback,
        "sudo": this.sudoCallback,
        "apt": this.aptCallback,
        "apt-get": this.aptCallback,
        "df": this.dfCallback
    };

    this.init();
    return this;
}
