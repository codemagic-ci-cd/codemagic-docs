---
title: Common Android issues
description: How to overcome common issues building Android mobile apps on Codemagic
weight: 2
---

### Builds work locally but fail on Codemagic

###### Description
Builds succeeds locally but fails on Codemagic, throwing vague errors (e.g. _**Gradle task bundleRelease failed with exit code 1**_), or the build is successful, but some functions aren't working.

###### Cause
These issues are likely caused by plugin and/or gradle versions used locally being different from the versions used on Codemagic. If you are using a gradle version that is different from Codemagic, you have to define it in `gradle wrapper`. Otherwise, Codemagic ignores your `build.gradle` file, and your build won't work properly. See which software versions Codemagic uses on [macOS](../specs/versions-macos), on [Linux](../specs/versions-linux) and on [Windows](../specs/versions-windows) instances.

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


### Java heap space out of memory error or JVM garbage collector is thrashing

###### Description
Builds fail with the below error:

    ERROR:: R8: java.lang.OutOfMemoryError: Java heap space
    FAILURE: Build failed with an exception.
    * What went wrong:
    Execution failed for task ':app:minifyReleaseWithR8'.
    > com.android.tools.r8.CompilationFailedException: Compilation failed to complete

Or

    FAILURE: Build failed with an exception.
    * What went wrong:
    Gradle build daemon has been stopped: since the JVM garbage collector is thrashing


###### Solution

Java Heap space error is a well-known issue and can be thrown for multiple reasons e.g. enabling ProGuard or DexGuard requires more power to complete the tasks. Here are some suggested solutions to try:

1. Set **JAVA_TOOL_OPTIONS: "-Xmx5g"** as an environement variable. This allows the JVM to use up to 5 GB of memory, which can help prevent memory allocation errors.

{{< highlight yaml "style=paraiso-dark">}}
  workflows:
    android-workflow:
      # ....
      environment:
        groups:
          # ...
        vars:
          JAVA_TOOL_OPTIONS: "-Xmx5g"
{{< /highlight >}}
- if using Workflow Editor - add `JAVA_TOOL_OPTIONS` with the value `-Xmx5g` under the Environment Variables section

2. Upgrading to the latest version of Gradle in the `gradle-wrapper.properties` file and the Android Gradle plugin in the `android/build.gradle` file to the latest version could help fix the issue. You can refer to the Official Documentation from Android Developer guides to learn more about the latest compatible version [here](https://developer.android.com/studio/releases/gradle-plugin#updating-gradle).
3. Set the maximum heap size by adding **-Dorg.gradle.jvmargs="-Xmx4096m"** to the build command or you can add the following line in **android/gradlew**:

```
exec "$JAVACMD" "${JVM_OPTS[@]}" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain -Dorg.gradle.jvmargs="-Xmx4096m" "$@"
```
{{<notebox>}}
To access more powerful macOS M2 Max Studio, and M2 Ultra machines, please get in touch with us [here](https://codemagic.io/contact/). 
{{</notebox>}}

### Could not find method firebaseAppDistribution() for arguments...

###### Description
When publishing to Firebase app Distribution using Gradle, build fails with this error "Could not find method firebaseAppDistribution() for arguments..."

###### Cause
This issue is likely caused by missing Distribution Gradle plugin or missing dependency for the App Distribution Gradle plugin.

###### Solution
1. In your root-level (project-level) Gradle file (usually android/build.gradle), add the App Distribution Gradle plugin as a buildscript dependency:

{{< highlight groovy "style=paraiso-dark">}}
buildscript {
  repositories {
    // Make sure that you have the following two repositories
    google()  // Google's Maven repository
    mavenCentral()  // Maven Central repository
  }

  dependencies {
      ...
      classpath("com.android.tools.build:gradle:7.2.0")

      // Make sure that you have the Google services Gradle plugin dependency
      classpath("com.google.gms:google-services:4.3.15")

      // Add the dependency for the App Distribution Gradle plugin
      classpath("com.google.firebase:firebase-appdistribution-gradle:4.0.0")
  }
}
{{< /highlight >}}

2. In your module (app-level) Gradle file (usually android/app/build.gradle), add the App Distribution Gradle plugin, and make sure that it is located below **com.android.application** plugin because the sequence of applying plugin matters:

{{< highlight groovy "style=paraiso-dark">}}
apply plugin: 'com.android.application'
apply plugin: 'com.google.firebase.appdistribution'
{{< /highlight >}}

Check the [official Firebase documentation](https://firebase.google.com/docs/app-distribution/android/distribute-gradle?apptype=aab#step_1_set_up_your_android_project) for more information.
