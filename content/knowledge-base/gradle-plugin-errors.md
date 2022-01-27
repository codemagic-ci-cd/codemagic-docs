---
title: Gradle Plugin Errors
weight: 2
---


## Troubleshooting Gradle Plugin Errors

Android users experiencing issues resolving plugins because of the sunset of JCenter.

On February 3 2021, JFrog, the company that maintains the JCenter, [announced that they will be shutting down Bintray and JCenter](https://jfrog.com/blog/into-the-sunset-bintray-jcenter-gocenter-and-chartcenter/). 

To avoid disruptions to your build pipelines start migrating to a new hosting solution, rather than using JCenter or Bintray.
There is no guarantee that old packages will be available for downloading after February 1st 2022. Thereafter, projects that have dependencies hosted in JCenter will fail fetching packages and stop compiling.

### Steps to prepare your build for the JCenter shutdown:

- Developers who uses packages from JCenter must point their projects to the new repositories to be able to get the latest versions.
- To fully migrate away from JCenter, replace all jcenter() occurrences with `mavenCentral()` in all build.gradle files.
```
    repositories {
        mavenCentral()
        google()
        
        //other repos
    }
```
- Disable or delete cache.
- Run your build pipeline to see if everything works still.
  - If your build is successful, you’re done.
  - If your build fails, you’ll need to troubleshoot which dependencies still require JCenter. 
  The errors in the failed build step will point out the dependecies requiring JCenter.
  
  #### Important resources to look at:
  - https://blog.gradle.org/plugins-jcenter
  - https://stackoverflow.com/questions/70687342/jcenter-bintray-com-is-down-error-502-bad-gateway


