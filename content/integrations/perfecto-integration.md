---
title: Perfecto integration
description: How to integrate your workflows with Perfecto using codemagic.yaml
weight: 13
---

**Perfect** is a cloud-based test automation platform for web and mobile that allows application developers and QA engineers to create and execute tests across devices and browsers at scale. Being a market leader in its area, Perfecto offers many ways to integrate with different stages of the software development and testing lifecycle. In this article, we will cover two of them:
1. How to integrate with Perfecto using codemagic.yaml
2. How to integrate your Flutter project with Perfecto 

## Integrate with Perfecto
###### How to integrate your workflows with Perfecto using codemagic.yaml

You need a Perfecto account in order to get credentials for the upload process. If you are not already a Perfecto user, you can [sign up for their free trial](https://www.perfecto.io/)

Using the following cURL script in a post-build script(a script that is run after executing build commands in yaml), **Release APK** and **Release IPA** binaries can be uploaded to the Perfecto platform:

```
curl "https://web.app.perfectomobile.com/repository/api/v1/artifacts" -H "Perfecto-Authorization: $PERFECTO_TOKEN" -H "Content-Type: multipart/form-data" -F "requestPart={\"artifactLocator\":\"PRIVATE:app.aab\",\"artifactType\":\"ANDROID\",\"override\":true}" -F "inputStream=@/path/to/your_binary"
```

**PERFECTO_TOKEN** can be found in the Perfecto UI with your account. Environment variables can be added in the Codemagic web app using the ‘Environment variables tab. You can then import your variable groups into your codemagic.yaml. For example, if you named your variable group ‘perfecto_credentials’, you would import it as follows:

```
workflows:
  workflow-name:
    environment:
      groups:
        - perfecto_credentials
```

For further information about using variable groups please click [here](.../variables/environment-variable-groups/).

{{<notebox>}}
Note: The uploaded files can be directly used to start your automation testing. To do this, desired capabilities can be set inside your custom-made test scripts in your project. For example, if your testing includes camera usage(QR code, Barcode) or biometric scanning (FaceID/Fingerprint), then **sensorInstrument** needs to be set as follows:
	
**capabilities.setCapability("sensorInstrument", true);**
{{</notebox>}}
	

## Flutter apps integration

######Set up the Flutter integration for Android apps


In order to set up integration for Flutter specific apps the following steps must be followed:

1. Generate a folder named **PerfectoRunAndroid** (can be named differently) in the root directory of your project.

2. Moving into **PerfectoRunAndroid** directory and initiate Gradle by executing the following commands in your local terminal:
```
cd PerfectoRun 
gradle init 
./gradlew wrapper
```
3. Running these commands will create the necessary gradle files along with an empty **build.gradle** and its content needs to be adjusted as follows:

```
buildscript {
    repositories {
        maven {
            url "https://repo1.perfectomobile.com/public/repositories/maven/"      
        }
        google()
        mavenCentral()
        
    }
    dependencies {
        classpath "com.perfectomobile.instrumentedtest.gradleplugin:plugin:+"
           
        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}
// Apply the plugin 
apply plugin: 'com.perfectomobile.instrumentedtest.gradleplugin'
perfectoGradleSettings {
    configFileLocation "ConfigFile.json"
}
    task clean(type: Delete) {
        delete rootProject.buildDir
}
```

3. Create a file called **ConfigFile.json** and add the following Json content in there:

```
{
      "cloudURL": "web-fra.perfectomobile.com",
      "securityToken": "xxxxxxxxxxxx",
      "devices": [
       
            {
              "platformName" : "Android",
              "platformVersion": "^12.*”,
              “description”:”free”
            },
            {
              "platformName_" : "Android",
              "platformVersion_": "^11.*”,
              “description”:”free”
            }
      ],
      "jobName": "some_job",
      "jobNumber": 1,
      "branch": "some_branch",
      "projectName": "My_Flutter_project",
      "projectVersion": "v1.0",
      "tags": [
        "espresso", "plugin"  ],
      "apkPath": "YOUR_APK_PATH",
      "testApkPath": "YOUR_TEST_APK_PATH",
      "installationDetails" : {"preCleanUp" : "true"},
      "postExecution" : {"uninstall" : "false" },
      "debug": false,
      "failBuildOnFailure": false,
      "takeScreenshotOnTestFailure": true,
      "shard": false,
      "testTimeout" : 60000
    }
```

**"securityToken"** contains your Perfecto Token that can be fetched from your Perfecto account.

In order to generate **testBuildType** which refers to **testApkPath**, the following command needs to be run in a pre-build script (a script that is run after executing build commands) inside **codemagic.yaml**:

```
- name: Build Android Test release
  script: |
      ./gradlew assembleAndroidTest
```
5. As a last step, to successfully upload files and enable test automation, the following commands needs to be executed:

```
- name: Upload files to Perfecto and run tests
  script: |
      cd PerfectoRunAndroid
      ./gradlew perfecto-android-inst
```

######Set up the Flutter integration for iOS apps

Set up the Flutter integration for iOS apps

Flutter iOS apps take almost the step steps as android builds:

1. Create another folder in the root directory named **PerfectoRunIos** (can be named differently)
2. Manually create **build.gradle** along with the following cconten:
```
buildscript {
    repositories {
            maven {
                url "https://repo1.perfectomobile.com/public/repositories/maven"        
            }
    }
    dependencies {
        classpath "com.perfectomobile.instrumentedtest.gradleplugin:plugin:+"    
    }
}
apply plugin: 'com.perfectomobile.instrumentedtest.gradleplugin'
perfectoGradleSettings {
    configFileLocation "configFile.json"}
```
3. Create **configFile.json** and add the following content in there:
```
{
    "cloudURL": "beta.perfectomobile.com",
    "securityToken":"xxxxxxxxxxxx",
   
	
	"appPath":"repository:PATH_TO_IPA",
	"hostedTestModuleName":"RunnerTests",
	"isHostedTestModule":true,
	
	
	"devices": [
			{"deviceName":"00008020-000D2CC42ED8002E"},
			{"deviceName":"00008101-000B05283081401E"}
	],
	"shard": false,
	"jobName": "Flutter_iOS_Job",
  	"jobNumber": 1,
  	"branch": "Flutter_Branch",
  	"projectName": "My_Flutter_iOS_Project",
  	"projectVersion": "v1.0",
  	"tags": [
    "XCUI", "plugin"  ],
	"takeScreenshotOnTestFailure": false,
	"takeScreenshotOnTestEnd": false,
	"takeScreenshotOnTestStep": false,
	"runUITests":true,
	"runUnitTests":false,
	"installationDetails": {
		"resign": true
	  },
	  
  	"numOfDevices": 2
  }
```
4. In order to successfully upload files and enable test automation, the following commands needs to be executed:

```
- name: Upload iOS files to Perfecto and run tests
  script: |
      cd PerfectoRunIos
      gradle perfecto-xctest
```

## Sample projects

A sample project that shows how to configure Perfecto integration for real device testing is available [here](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/perfecto_sample_project)

Additionally, to see a sample project that shows how to configure the Perfecto integration for App Automate for Flutter apps is available [here (https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/perfecto_flutter_sample_project)
