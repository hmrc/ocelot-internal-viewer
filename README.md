
# ocelot-internal-viewer

This is the development version of the viewer for the internal guidance
platform. Most people won't need to use this.

## Instructions

  * Create a folder to work out of (I'm going to assume "C:\Ocelot")
  * Clone this repo into the folder ("git clone git@github.com:/hmrc/ocelot-internal-viewer C:\Ocelot")
  * Run "PowerShell" as Administrator. This will open a prompt. In that prompt
      * cd C:\Ocelot\bin
      * .\[setup-iis.ps1](./bin/setup-iis.ps1)

This will download, install, and setup IIS. Once it's done, the script will
open a browser with a link to the new site.

### License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
