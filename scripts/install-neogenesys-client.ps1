# Neogenesys Network Client - One-Line Installer
# This script downloads and installs the rebranded Netbird client
# Usage: iex ((New-Object System.Net.WebClient).DownloadString('https://install.neogenesys.com/install.ps1'))

param(
    [Parameter(Mandatory=$false)]
    [string]$SetupKey = "",
    
    [Parameter(Mandatory=$false)]
    [string]$DeviceName = $env:COMPUTERNAME,
    
    [Parameter(Mandatory=$false)]
    [switch]$Silent = $true
)

# Configuration
$ClientVersion = "latest"
$DownloadUrl = "https://github.com/infra-neo/netbird-rebrand/releases/$ClientVersion/download/neogenesys-client-installer.exe"
$InstallerPath = "$env:TEMP\neogenesys-client-installer.exe"
$ServiceName = "NeogenesysNetwork"
$ProcessName = "neogenesys-client"
$AdapterName = "Neogenesys Network"

# Colors for output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Banner {
    Write-ColorOutput @"

╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           Neogenesys Network Client Installer                ║
║                                                              ║
║              Zero Trust Network Access                       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

"@ -Color Cyan
}

function Test-AdminPrivileges {
    $currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Stop-ExistingService {
    Write-ColorOutput "Checking for existing installation..." -Color Yellow
    
    # Stop service if running
    $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($service) {
        if ($service.Status -eq 'Running') {
            Write-ColorOutput "Stopping existing service..." -Color Yellow
            Stop-Service -Name $ServiceName -Force
            Start-Sleep -Seconds 2
        }
    }
    
    # Kill process if running
    $process = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    if ($process) {
        Write-ColorOutput "Stopping existing process..." -Color Yellow
        Stop-Process -Name $ProcessName -Force
        Start-Sleep -Seconds 2
    }
}

function Download-Client {
    Write-ColorOutput "Downloading Neogenesys Network Client..." -Color Cyan
    
    try {
        # Use TLS 1.2
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        
        # Download with progress
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($DownloadUrl, $InstallerPath)
        
        Write-ColorOutput "✓ Download complete!" -Color Green
        return $true
    }
    catch {
        Write-ColorOutput "✗ Download failed: $_" -Color Red
        return $false
    }
}

function Install-Client {
    Write-ColorOutput "Installing Neogenesys Network Client..." -Color Cyan
    
    try {
        $installArgs = @("/S")  # Silent install
        
        if ($SetupKey) {
            $installArgs += "/setupkey=$SetupKey"
        }
        
        if ($DeviceName) {
            $installArgs += "/name=$DeviceName"
        }
        
        $installArgs += "/service=$ServiceName"
        $installArgs += "/process=$ProcessName"
        $installArgs += "/adapter=$AdapterName"
        
        $process = Start-Process -FilePath $InstallerPath -ArgumentList $installArgs -Wait -PassThru
        
        if ($process.ExitCode -eq 0) {
            Write-ColorOutput "✓ Installation complete!" -Color Green
            return $true
        }
        else {
            Write-ColorOutput "✗ Installation failed with exit code: $($process.ExitCode)" -Color Red
            return $false
        }
    }
    catch {
        Write-ColorOutput "✗ Installation error: $_" -Color Red
        return $false
    }
}

function Configure-NetworkAdapter {
    Write-ColorOutput "Configuring network adapter..." -Color Cyan
    
    # Wait for adapter to be created
    Start-Sleep -Seconds 3
    
    try {
        # Find the adapter
        $adapter = Get-NetAdapter | Where-Object { $_.InterfaceDescription -like "*$AdapterName*" }
        
        if ($adapter) {
            # Rename if needed
            if ($adapter.Name -ne $AdapterName) {
                Rename-NetAdapter -Name $adapter.Name -NewName $AdapterName -ErrorAction SilentlyContinue
            }
            
            Write-ColorOutput "✓ Network adapter configured!" -Color Green
            return $true
        }
        else {
            Write-ColorOutput "⚠ Network adapter not found yet (this is normal)" -Color Yellow
            return $true
        }
    }
    catch {
        Write-ColorOutput "⚠ Could not configure adapter: $_" -Color Yellow
        return $true
    }
}

function Start-Client {
    Write-ColorOutput "Starting Neogenesys Network Client..." -Color Cyan
    
    try {
        # Start service
        $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
        if ($service) {
            Start-Service -Name $ServiceName
            Start-Sleep -Seconds 3
            
            $service = Get-Service -Name $ServiceName
            if ($service.Status -eq 'Running') {
                Write-ColorOutput "✓ Service started successfully!" -Color Green
                return $true
            }
            else {
                Write-ColorOutput "⚠ Service not running" -Color Yellow
                return $false
            }
        }
        else {
            Write-ColorOutput "⚠ Service not found" -Color Yellow
            return $false
        }
    }
    catch {
        Write-ColorOutput "✗ Error starting service: $_" -Color Red
        return $false
    }
}

function Show-Status {
    Write-ColorOutput "`n╔══════════════════════════════════════════════════════════════╗" -Color Cyan
    Write-ColorOutput "║                     Installation Status                      ║" -Color Cyan
    Write-ColorOutput "╚══════════════════════════════════════════════════════════════╝`n" -Color Cyan
    
    # Check service
    $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($service) {
        $status = $service.Status
        $color = if ($status -eq 'Running') { 'Green' } else { 'Yellow' }
        Write-ColorOutput "Service Status: $status" -Color $color
    }
    
    # Check adapter
    $adapter = Get-NetAdapter | Where-Object { $_.InterfaceDescription -like "*$AdapterName*" } -ErrorAction SilentlyContinue
    if ($adapter) {
        Write-ColorOutput "Network Adapter: $($adapter.Name)" -Color Green
        Write-ColorOutput "Status: $($adapter.Status)" -Color Green
    }
    
    Write-ColorOutput "`n✓ Neogenesys Network Client is installed and ready!" -Color Green
    Write-ColorOutput "`nYou can now access internal resources through the Neogenesys portal." -Color White
    Write-ColorOutput "Visit: https://dashboard.pomerium.local`n" -Color Cyan
}

function Cleanup {
    Write-ColorOutput "Cleaning up..." -Color Yellow
    
    if (Test-Path $InstallerPath) {
        Remove-Item $InstallerPath -Force -ErrorAction SilentlyContinue
    }
}

# Main Installation Process
function Main {
    Write-Banner
    
    # Check admin privileges
    if (-not (Test-AdminPrivileges)) {
        Write-ColorOutput "✗ This script requires administrator privileges!" -Color Red
        Write-ColorOutput "Please run PowerShell as Administrator and try again.`n" -Color Yellow
        exit 1
    }
    
    Write-ColorOutput "Starting installation process...`n" -Color White
    
    # Installation steps
    Stop-ExistingService
    
    if (-not (Download-Client)) {
        Write-ColorOutput "`n✗ Installation failed during download.`n" -Color Red
        exit 1
    }
    
    if (-not (Install-Client)) {
        Write-ColorOutput "`n✗ Installation failed.`n" -Color Red
        Cleanup
        exit 1
    }
    
    Configure-NetworkAdapter
    Start-Client
    Cleanup
    
    Write-ColorOutput ""
    Show-Status
}

# Execute
Main
