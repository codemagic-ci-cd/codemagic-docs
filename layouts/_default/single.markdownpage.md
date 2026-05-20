{{- $lastmod := .Lastmod.Format "2006-01-02" -}}
<!-- source: {{ .Permalink }} -->
<!-- last modified: {{ $lastmod }} -->

# {{ .Title }}
{{ with .Params.description }}
> {{ . }}
{{ end }}

{{- /* Initialize scratchpad */ -}}
{{- $.Scratch.Set "content" .RawContent -}}

{{/* =========================================================
   STAGE 1: EXPAND NESTED INCLUDES (RECURSIVE & SCOPE-SAFE)
   ========================================================= */}}
{{- range seq 10 -}}
  {{- $currentContent := $.Scratch.Get "content" -}}
  {{- if in $currentContent "{{< include \"" -}}
    {{- $chunks := split $currentContent "{{< include \"" -}}
    {{- $.Scratch.Set "finalContent" (index $chunks 0) -}}
    
    {{- range $idx, $chunk := $chunks -}}
      {{- if gt $idx 0 -}}
        {{- $parts := split $chunk "\" >}}" -}}
        {{- $path := index $parts 0 -}}
        {{- $restOfText := index $parts 1 -}}
        
        {{- $includePage := $.Site.GetPage $path -}}
        {{- $injectedContent := "" -}}
        {{- if $includePage -}}
          {{- $injectedContent = $includePage.RawContent -}}
        {{- else -}}
          {{- $cleanPath := replace $path "/partials/" "" -}}
          {{- if templates.Exists (printf "partials/%s" $cleanPath) -}}
            {{- $injectedContent = partial $cleanPath $ -}}
          {{- end -}}
        {{- end -}}
        
        {{- $runningContent := $.Scratch.Get "finalContent" -}}
        {{- $.Scratch.Set "finalContent" (printf "%s%s%s" $runningContent $injectedContent $restOfText) -}}
      {{- end -}}
    {{- end -}}
    
    {{- $.Scratch.Set "content" ($.Scratch.Get "finalContent") -}}
  {{- end -}}
{{- end -}}


{{/* =========================================================
   STAGE 2: FLATTEN TABS & CLEAN WRAPPER TAGS
   ========================================================= */}}
{{- $processedContent := $.Scratch.Get "content" -}}

{{- if in $processedContent "{{< tab header=\"" -}}
  {{- $tabChunks := split $processedContent "{{< tab header=\"" -}}
  {{- $.Scratch.Set "flattenedTabs" (index $tabChunks 0) -}}
  
  {{- range $idx, $chunk := $tabChunks -}}
    {{- if gt $idx 0 -}}
      {{- $parts := split $chunk "\" >}}" -}}
      {{- $headerName := index $parts 0 -}}
      {{- $tabBody := index $parts 1 -}}
      
      {{- $runningTabs := $.Scratch.Get "flattenedTabs" -}}
      {{- $.Scratch.Set "flattenedTabs" (printf "%s\n\n### Option: %s\n\n%s" $runningTabs $headerName $tabBody) -}}
    {{- end -}}
  {{- end -}}
  {{- $processedContent = $.Scratch.Get "flattenedTabs" -}}
{{- end -}}

{{- $processedContent = replace $processedContent "{{< tabpane >}}" "" -}}
{{- $processedContent = replace $processedContent "{{< /tabpane >}}" "" -}}
{{- $processedContent = replace $processedContent "{{<markdown>}}" "" -}}
{{- $processedContent = replace $processedContent "{{</markdown>}}" "" -}}
{{- $processedContent = replace $processedContent "{{< /tab >}}" "" -}}


{{/* =========================================================
   STAGE 3: CONVERT ALL HIGHLIGHT VARIANTS TO MARKDOWN CODEBLOCKS
   ========================================================= */}}
{{- /* Step A: Normalize all opening tags (highlight & highlight-editable) to uniform markdown syntax */ -}}
{{- $processedContent = replaceRE `\{\{\s*<\s*highlight\s+([a-zA-Z0-9_-]+)[^>]*>\s*\}\}` "\n```$1\n" $processedContent -}}
{{- $processedContent = replaceRE `\{\{\s*<\s*highlight-editable\s+([a-zA-Z0-9_-]+)[^>]*>\s*\}\}` "\n```$1\n" $processedContent -}}

{{- /* Step B: Normalize all closing tags to a temporary uniform string to guarantee we catch them all together */ -}}
{{- $processedContent = replaceRE `\{\{\s*<\s*/highlight\s*>\s*\}\}` "{{</closeblock>}}" $processedContent -}}
{{- $processedContent = replaceRE `\{\{\s*<\s*/highlight-editable\s*>\s*\}\}` "{{</closeblock>}}" $processedContent -}}

{{- /* Step C: Safely replace all uniform closing tags with clean markdown backticks */ -}}
{{- $processedContent = replace $processedContent "{{</closeblock>}}" "\n```\n" -}}


{{/* =========================================================
   STAGE 4: STRIP VARIABLES FROM EDITABLE CODE BLOCKS
   ========================================================= */}}
{{- if in $processedContent "$$$" -}}
  {{- /* Strip out the $$$variable-name$$$ formatting, leaving only the value */ -}}
  {{- /* Matches: $$$id$$$value$$$ -> value */ -}}
  {{- $processedContent = replaceRE `\$\$\$[a-zA-Z0-9_-]+\$\$\$(.*?)\$\$$` "$1" $processedContent -}}
{{- end -}}


{{/* =========================================================
   STAGE 5: CONVERT NOTEBOXES TO MARKDOWN BLOCKQUOTES
   ========================================================= */}}
{{- if in $processedContent "notebox" -}}
  {{- /* Standardize tags */ -}}
  {{- $processedContent = replaceRE `\{\{\s*<\s*notebox\s*>\s*\}\}` "{{<notebox>}}" $processedContent -}}
  {{- $processedContent = replaceRE `\{\{\s*<\s*/notebox\s*>\s*\}\}` "{{</notebox>}}" $processedContent -}}
  
  {{- /* Split by the opening notebox tag to cleanly prepend blockquote markers to every line inside */ -}}
  {{- $noteChunks := split $processedContent "{{<notebox>}}" -}}
  {{- $.Scratch.Set "cleanNotes" (index $noteChunks 0) -}}
  
  {{- range $idx, $chunk := $noteChunks -}}
    {{- if gt $idx 0 -}}
      {{- $parts := split $chunk "{{</notebox>}}" -}}
      {{- $noteBody := index $parts 0 -}}
      {{- $restOfText := index $parts 1 -}}
      
      {{- /* Prepend > to each line within the note block */ -}}
      {{- $blockquoteLines := slice -}}
      {{- range (split $noteBody "\n") -}}
         {{- $blockquoteLines = $blockquoteLines | append (printf "> %s" .) -}}
      {{- end -}}
      {{- $formattedNote := delimit $blockquoteLines "\n" -}}
      
      {{- $runningNotes := $.Scratch.Get "cleanNotes" -}}
      {{- $.Scratch.Set "cleanNotes" (printf "%s\n\n%s\n\n%s" $runningNotes $formattedNote $restOfText) -}}
    {{- end -}}
  {{- end -}}
  {{- $processedContent = $.Scratch.Get "cleanNotes" -}}
{{- end -}}

{{ $processedContent }}