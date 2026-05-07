{{- $lastmod := .Lastmod.Format "2006-01-02" -}}
<!-- source: {{ .Permalink }} -->
<!-- last modified: {{ $lastmod }} -->

# {{ .Title }}
{{ with .Params.description }}
> {{ . }}
{{ end }}
{{ .RawContent -}}