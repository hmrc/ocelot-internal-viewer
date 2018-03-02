
# Before you run this script, you should clone this repo somewhere:

#     git clone git@github.com:hmrc/ocelot-internal-viewer

# Set $websitePath to the folder where you cloned the repo

$websitePath = "C:\Ocelot"

# Install IIS
Enable-WindowsOptionalFeature -All -Online -FeatureName IIS-ASP

# Import IIS controls
Import-Module WebAdministration

# Remove any old versions of the site (if there is one)
$site = "iis:\Sites\Ocelot"
if (Test-Path $site) {
    Remove-Item -Recurse $site
}

# Create the new site
$path = Get-Item ($websitePath + "\wwwroot")
New-Item $site -bindings @{protocol="http";bindingInformation="*:8080:*"} -physicalPath $path

# Open the site (to show it works)
Start-Process -FilePath http://localhost:8080/