{{- $lastmod := .Lastmod.Format "2006-01-02" -}}
# {{ .Title }}
{{ with .Params.description }}
> {{ . }}
{{ end }}
For AI agents: documentation index: {{ "llms.txt" | absURL }} · whole corpus in one file: {{ "llms-full.txt" | absURL }} · HTML version of this page: {{ .Permalink }}

{{ partial "clean-markdown.html" . }}
