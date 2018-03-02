
# ocelot-internal-viewer

This is the development version of the viewer for the internal guidance
platform. Most people won't need to use this.

## Instructions

  * Install [Git for Windows](https://git-scm.com/download/win)
  * Create a folder to work out of (I'm going to assume "C:\Ocelot")
  * Start a Git Bash shell and run the command
      * `git clone git@github.com:/hmrc/ocelot-internal-viewer /c/Ocelot`
  * Run "PowerShell" as Administrator. This will open a prompt. In that prompt run the command:
      * `C:\Ocelot\bin\setup-iis.ps1`

This will download, install, and setup IIS. Once it's done, the script will
open a browser with a link to the new site.

### License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
