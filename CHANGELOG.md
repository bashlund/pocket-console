# CHANGELOG: pocket-console

## [0.5.0] - 20230210
Add push/popFormat().  
Fix bug in resetting coloring.  

## [0.4.0] - 20230202
Fix bug about wrongly using console.group for stderr output.  
Fix bug about properly outputting Error objects.  
Implement format grouping and string splitting on terminal width for use on stderr on terminal output.  

## [0.3.1] - 20230117
Fix bug about undefined args in output.  
Change emojis for INFO and DEBUG levels.  

## [0.3.0] - 20221207
Rename logLevel/logFormat to LOG_LEVEL/LOG_FORMAT.  
Fix bug: when using many PocketConsole objects simultanously.  
Fix bug: setLevel was not set on object.  
Add isPocket guard to not accidentally wrap pocket in pocket.  
Add options.useToString to toggle using available toString() on class instances.  

## [0.2.0] - 20221013
Change the API to be a full drop-in-replacement of the Console object.

## [0.1.0] - 20221012
First release.
