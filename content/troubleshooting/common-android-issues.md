---
title: Common Android issues
weight: 2
---

## Version inconsistency between local and Codemagic

**Description**:
Builds succeed locally but not on Codemagic and throw vague errors, such as `Gradle task bundleRelease failed with exit code 1`, or the build is successful, but some functions aren't working.

**Cause**: These issues are likely caused because plugin and gradle versions used locally are different from the versions used on Codemagic. If you are using a gradle version that is different from Codemagic, you have to define it in `gradle wrapper`. Otherwise, Codemagic ignores your `build.gradle` file, and your build won't work properly. See which [software versions Codemagic uses](../releases-and-versions/versions/).

**Solution**: First, you need to make sure that the `gradlew` file isn't in `.gitignore`. Look for `**/android/gradlew`, and if it's in `.gitignore`, delete it from there. Then add `!gradle-wrapper.jar` to a new line in `.gitignore` to create an exception so that `gradle-wrapper.jar` would also be excluded from `.gitignore`.

Run `./gradlew wrapper --gradle-version [your gradle version]` locally to create `gradlew` and `gradle-wrapper.properties` files in your repository. Commit the changes and rerun your Codemagic build.

**Additional steps**: Additional steps are required if you see the following error during the build process:

`Error! Failed to check gradle version. Malformed executable tmpABCDEF/gradlew`

Codemagic runs `./gradlew --version` on the builder side to check if it's suitable for execution. If you see the error message shown above, there is something wrong with checking the gradle version.

**To investigate and fix the issues**:

- Make a clean clone of the repository and execute the following commands:

```bash
cd <project_root>
chmod +x gradlew
./gradlew --version
```

- Make a fix for the issue found.
- Commit changes to the repo.
- Run the build again in Codemagic.

## Troubleshooting Gradle plugin errors

Android users experiencing issues resolving plugins because of the sunset of JCenter.

On February 3, 2021, JFrog, the company that maintains JCenter, [announced that they will be shutting down Bintray and JCenter](https://jfrog.com/blog/into-the-sunset-bintray-jcenter-gocenter-and-chartcenter/).

To avoid disruptions to your build pipelines, start migrating to a new hosting solution like `mavenCentral()`, rather than using JCenter or Bintray.

### Java heap space out of memory error for M1 builds

**Description**:
Builds succeed on Mac Pro machines but fail on M1 machines with the below error.

```bash
ERROR:: R8: java.lang.OutOfMemoryError: Java heap space
FAILURE: Build failed with an exception.
* What went wrong:
Execution failed for task ':app:minifyReleaseWithR8'.
> com.android.tools.r8.CompilationFailedException: Compilation failed to complete
```

**Solution**: Upgrading to the latest version of Gradle in the `gradle-wrapper.properties` file and the Android Gradle plugin in the `android/build.gradle` file to the latest version fixes the issue. You can refer to the Official Documentation from Android Developer guides to learn more about the latest compatible version [here](https://developer.android.com/studio/releases/gradle-plugin#updating-gradle).

### Steps to prepare your build for the JCenter shutdown

- Developers who use packages from JCenter must point their projects to the new repositories to be able to get the latest versions.
- To fully migrate away from JCenter, replace all `jcenter()` occurrences with `mavenCentral()` in all build.gradle files.

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
  - If your build still fails, you’ll need to troubleshoot which dependencies still require JCenter. The errors in the failed build step will point out the dependecies using JCenter.

{{<notebox>}}
Note: You'll have to completely upgrade all dependencies that require JCenter to avoid failed builds.
{{</notebox>}}
