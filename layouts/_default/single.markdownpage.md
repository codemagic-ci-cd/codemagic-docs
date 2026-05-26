{{- $lastmod := .Lastmod.Format "2006-01-02" -}}
# {{ .Title }}
{{ with .Params.description }}
> {{ . }}
{{ end }}

{{ partial "clean-markdown.html" . }}