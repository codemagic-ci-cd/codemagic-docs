---
title: Post-publish scripts
description: How to add post-publish scripts in codemagic.yaml
weight: 13
---

Codemagic has a number of integrations for publishing but you can also publish elsewhere with custom scripts.

{{<notebox>}}
**Note:** By default, the publishing scripts are run regardless of the build status except for ``canceled`` and ``timeout``. You can specify additional conditions using if statements in scripts themselves.
{{</notebox>}}

Below are just a few post-publish script examples to illustrate the most common options:

#### Publish only if .apk was created

{{< highlight yaml "style=paraiso-dark">}}

publishing:
  email:
    recipients:
      - name@example.com
  scripts:
    name: Check for apk
    script: | 
      apkPath=$(find build -name "*.apk" | head -1)
      if [[ -z ${apkPath} ]]
      then
        echo "No .apk were found"
      else
        echo "Publishing .apk artifacts"
      fi
{{< /highlight >}}


#### Report build status

{{< highlight yaml "style=paraiso-dark">}}

scripts:
  - name: Report build start
    script: # build started
    
    . . .
  
  - name: Build finished successfully
    script: touch ~/SUCCESS
publishing:
  scripts:
    - name: Report build status
      script: | 
        if [  -f ~/SUCCESS ] ; then
           # build successful
        else
           # build failed
        fi
  {{< /highlight >}}
  
  
#### Get artifact links
  
  {{< highlight yaml "style=paraiso-dark">}}

  publishing:
    scripts:
      - name: To get artifact URL
        script: | 
          ARTIFACT_TYPE=".apk" 
          ARTIFACT_URL=$(echo $CM_ARTIFACT_LINKS | jq -r '.[] | select(.name | endswith("'"$ARTIFACT_TYPE"'")) | .url')
{{< /highlight >}}        
 
