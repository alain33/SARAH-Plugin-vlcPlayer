'==============================
' Quit vlc
'==============================
Option explicit 

' Variables
Dim WshShell, objWMIService, colProcesses, objProcess, objPro
Dim sScriptPath, sVlc
Dim iReturnValue, NodePID

On Error Resume Next

'-- Initialize parameters
Set WshShell = WScript.CreateObject("WScript.Shell")
Set objWMIService = GetObject("winmgmts:{impersonationLevel=impersonate}")

iReturnValue = -1
sScriptPath = Replace(WScript.ScriptFullName, WScript.ScriptName, "")
sVlc = "vlc"

'-- Browse all of the process, and check their command line
WshShell.CurrentDirectory = sScriptPath
Set colProcesses = objWMIService.ExecQuery("Select * From Win32_Process")
For Each objProcess in colProcesses
	if not IsNull(objProcess.CommandLine) then
			
		' Process for VLC
		if InStr(1, objProcess.CommandLine, sVlc) <> 0 then
			NodePID = objProcess.ProcessId
			objProcess.Terminate()			
		end if
		
		' Child Process of VLC 
		For Each objPro in colProcesses
			if objPro.ParentProcessId = NodePID then
				objPro.Terminate()
			end if
		Next	
				
	end if
Next


'--  Destroy objects
Set colProcesses = nothing
Set objWMIService = nothing
Set WshShell = nothing

WScript.Quit(iReturnValue)


' Include VBS libraries
Sub includeFile(fSpec)
    With CreateObject("Scripting.FileSystemObject")
       executeGlobal .openTextFile(fSpec).readAll()
    End With
End Sub