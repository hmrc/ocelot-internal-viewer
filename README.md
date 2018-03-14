
# ocelot-internal-viewer

This is the development version of the viewer for the internal guidance
platform. Most people won't need to use this.

## Instructions

1. **Install** [Git for Windows](https://git-scm.com/download/win)
2. **Create** the folder 'C:\ocelot-internal-viewer'
3. **Start** a Git Bash shell and run the command `git clone git@github.com:/hmrc/ocelot-internal-viewer /c/ocelot-internal-viewer`
4. **Run** 'PowerShell' as Administrator
5. **Run** the command: `powershell -ExecutionPolicy Bypass`
6. **Run** the command: `C:\ocelot-internal-viewer\bin\init-ocelot-internal-viewer.ps1`

This will download, install, and setup IIS. Once it's done, the script will
open a browser with a link to the new site.

### License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
