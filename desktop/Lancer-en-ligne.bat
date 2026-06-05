@echo off
REM Application bureau (EN LIGNE) : ouvre la plateforme hebergee en fenetre dediee.
REM >>> Remplacez l'URL ci-dessous par votre domaine apres mise en ligne <<<
set "URL=https://academie-compta-fr.mg"
start "" msedge --app=%URL% --window-size=1280,860
if errorlevel 1 start "" "%URL%"
