---
title: Common Android issues
description: How to overcome common issues building Android mobile apps on Codemagic
weight: 2
---

### Builds work locally but fail on Codemagic

###### Description
Builds succeeds locally but fails on Codemagic, throwing vague errors (e.g. _**Gradle task bundleRelease failed with exit code 1**_), or the build is successful, but some functions aren't working.

###### Cause
These issues are likely caused by plugin and/or gradle versions used locally being different from the versions used on Codemagic. If you are using a gradle version that is different from Codemagic, you have to define it in `gradle wrapper`. Otherwise, Codemagic ignores your `build.gradle` file, and your build won't work properly. See which software versions Codemagic uses on [MacOS](../specs/versions-macos), on [Linux](../specs/versions-linux) and on [Windows](../specs/versions-windows) instances.

###### Solution
First, you need to make sure that the `gradlew` file isn't in `.gitignore`. Look for `**/android/gradlew`, and if it's in `.gitignore`, delete it from there. Then add `!gradle-wrapper.jar` to a new line in `.gitignore` to create an exception so that `gradle-wrapper.jar` would also be excluded from `.gitignore`.

Run `./gradlew wrapper --gradle-version [your gradle version]` locally to create `gradlew` and `gradle-wrapper.properties` files in your repository. Commit the changes and rerun your Codemagic build.

###### Additional steps
Additional steps are required if you see the following error during the build process:

_**Error! Failed to check gradle version. Malformed executable tmpABCDEF/gradlew**_

Codemagic runs `./gradlew --version` on the builder side to check if it is suitable for execution. If you see the error message shown above, there is something wrong with checking the gradle version.

**To investigate and fix the issues**:

1. Make a clean clone of the repository and execute the following commands:

{{< highlight bash "style=paraiso-dark">}}
  cd <project_root>
  chmod +x gradlew
  ./gradlew --version
{{< /highlight >}}

2. Make a fix for the issue found.
3. Commit changes to the repo.
4. Run the build again in Codemagic.



### Cannot resolve Gradle plugin

###### Description
Android users experiencing issues resolving plugins because of the sunset of JCenter.

###### Cause
On February 3. 2021, JFrog, the company that maintains JCenter, [announced that they will be shutting down Bintray and JCenter](https://jfrog.com/blog/into-the-sunset-bintray-jcenter-gocenter-and-chartcenter/).

###### Solution
To avoid disruptions to your build pipelines, start migrating to a new hosting solution like `mavenCentral()`, rather than using JCenter or Bintray.

To fully migrate away from JCenter, replace all `jcenter()` occurrences with `mavenCentral()` in all build.gradle files.

{{< highlight groovy "style=paraiso-dark">}}
  repositories {
    mavenCentral()
      google()

      //other repos
    }
{{< /highlight >}}

- Disable or delete cache.
- Run your build pipeline to see if everything works still.
  - If your build is successful, you’re done.
  - If your build still fails, you’ll need to troubleshoot which dependencies still require JCenter. The errors in the failed build step will point out the dependencies using JCenter.

{{<notebox>}}
Note: You'll have to completely upgrade all dependencies that require JCenter to avoid failed builds.
{{</notebox>}}


### Java heap space out of memory error for M1 builds

###### Description
Builds succeed on Mac Pro machines but fail on M1 machines with the below error:

    ERROR:: R8: java.lang.OutOfMemoryError: Java heap space
    FAILURE: Build failed with an exception.
    * What went wrong:
    Execution failed for task ':app:minifyReleaseWithR8'.
    > com.android.tools.r8.CompilationFailedException: Compilation failed to complete


###### Solution
Upgrading to the latest version of Gradle in the `gradle-wrapper.properties` file and the Android Gradle plugin in the `android/build.gradle` file to the latest version fixes the issue.

You can refer to the Official Documentation from Android Developer guides to learn more about the latest compatible version [here](https://developer.android.com/studio/releases/gradle-plugin#updating-gradle).

