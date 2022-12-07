# CHANGELOG: pocket-console

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
