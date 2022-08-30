---
title: Post-publish
description: How to add post-publish scripts in codemagic.yaml
weight: 3
---

Codemagic has a number of integrations for publishing but you can also publish elsewhere with custom scripts. See the options under the [Publishing section](../publishing-yaml/distribution/).

Note that by default the publishing scripts are run regardless of the build status. You can specify additional conditions with if statements.

Below are a few post-publish script examples:


```yaml
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
```


- To report build status

```yaml
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
  ```
  
  
 - To get artifact links
  
  ```yaml
  publishing:
    scripts:
      - name: To get artifact URL
        script: |        
          ARTIFACT_TYPE=".apk" 
          ARTIFACT_URL=$(echo $CM_ARTIFACT_LINKS | jq -r '.[] | select(.name | endswith("'"$ARTIFACT_TYPE"'")) | .url')
```        
 
