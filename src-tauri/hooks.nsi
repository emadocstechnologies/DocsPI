; DocsPI NSIS Installer Hooks

!macro NSIS_HOOK_PREINSTALL
    nsExec::ExecToStack 'taskkill /F /IM DocsPI.exe'
    Pop $0
    nsExec::ExecToStack 'taskkill /F /IM docspi-proxy.exe'
    Pop $0
    nsExec::ExecToStack 'taskkill /F /IM docspi-divert.exe'
    Pop $0
    nsExec::ExecToStack 'taskkill /F /IM "docspi-divert-x86_64-pc-windows-msvc.exe"'
    Pop $0
    Sleep 1000

    nsExec::ExecToStack 'sc.exe stop WinDivert'
    Pop $0
    nsExec::ExecToStack 'sc.exe stop WinDivert14'
    Pop $0
    Sleep 1500
    nsExec::ExecToStack 'sc.exe delete WinDivert'
    Pop $0
    nsExec::ExecToStack 'sc.exe delete WinDivert14'
    Pop $0
    Sleep 1000

    Delete "$LOCALAPPDATA\DocsPI\WinDivert64.sys"
    Delete "$LOCALAPPDATA\DocsPI\WinDivert.dll"

    WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Internet Settings" "ProxyEnable" 0
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Internet Settings" "ProxyServer"
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Internet Settings" "ProxyOverride"
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Internet Settings" "AutoConfigURL"

    nsExec::ExecToStack 'netsh winhttp reset proxy'
    Pop $0

    Delete "$TEMP\docspi_proxy_active.lock"
    Delete "$TEMP\docspi_sidecar.pid"
    Delete "$TEMP\docspi_divert.pid"
    Delete "$TEMP\docspi_divert.log"
!macroend

!macro NSIS_HOOK_PREUNINSTALL
    nsExec::ExecToStack 'taskkill /F /IM DocsPI.exe'
    Pop $0
    nsExec::ExecToStack 'taskkill /F /IM docspi-proxy.exe'
    Pop $0
    nsExec::ExecToStack 'taskkill /F /IM docspi-divert.exe'
    Pop $0
    nsExec::ExecToStack 'taskkill /F /IM "docspi-divert-x86_64-pc-windows-msvc.exe"'
    Pop $0
    Sleep 1000

    nsExec::ExecToStack 'sc.exe stop WinDivert'
    Pop $0
    nsExec::ExecToStack 'sc.exe stop WinDivert14'
    Pop $0
    Sleep 1500
    nsExec::ExecToStack 'sc.exe delete WinDivert'
    Pop $0
    nsExec::ExecToStack 'sc.exe delete WinDivert14'
    Pop $0
    Sleep 1000

    Delete "$LOCALAPPDATA\DocsPI\WinDivert64.sys"
    Delete "$LOCALAPPDATA\DocsPI\WinDivert.dll"

    WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Internet Settings" "ProxyEnable" 0
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Internet Settings" "ProxyServer"
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Internet Settings" "ProxyOverride"
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Internet Settings" "AutoConfigURL"

    nsExec::ExecToStack 'netsh winhttp reset proxy'
    Pop $0

    Delete "$TEMP\docspi_proxy_active.lock"
    Delete "$TEMP\docspi_sidecar.pid"
    Delete "$TEMP\docspi_divert.pid"
    Delete "$TEMP\docspi_divert.log"

    nsExec::ExecToStack 'netsh advfirewall firewall delete rule name=DocsPI_Proxy'
    Pop $0
    nsExec::ExecToStack 'netsh advfirewall firewall delete rule name=DocsPI_PAC'
    Pop $0

    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "DocsPI"

    nsExec::ExecToStack 'ipconfig /flushdns'
    Pop $0
!macroend
